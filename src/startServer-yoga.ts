import "reflect-metadata";
import "dotenv/config";
import { createConnection } from "typeorm";
import { GraphQLServer } from "graphql-yoga";
import * as express from "express";
require("dotenv").config();

import { pubsub } from "./utils/pubsub";
import { upload } from "./utils/uploadImageRest";
import { genSchema } from "./utils/genSchema";
import { authMiddleware } from "./utils/middlewares";
import { userLoader } from "./loaders/userLoader";

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      req: request,
      pubsub,
      userLoader: userLoader()
    })
  });

  server.express.use(authMiddleware);

  server.express.use("/images", express.static("images"));

  // - - Cloudinary & Multer - -
  const cloudinary = require("cloudinary");
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  server.express.post("/image/upload", upload.single("photo"), (req: any) => {
    console.log(req.file.path);
    cloudinary.uploader.upload(req.file.path, function(result: any) {
      console.log(result);
    });
  });
  // - - End Cloudinary & Multer - -

  await createConnection();

  const port = process.env.PORT || 4000;

  await server.start({
    port
  });

  console.log("Server is running on localhost:4000");
};
