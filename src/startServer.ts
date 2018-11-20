import "reflect-metadata";
import "dotenv/config";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
require("dotenv").config();

import { pubsub } from "./utils/pubsub";
import { upload } from "./utils/uploadImageRest";
import { genSchema } from "./utils/genSchema";
import { authMiddleware } from "./utils/middlewares";
import { userLoader } from "./loaders/userLoader";

// Using Apollo Server Express

const app = express();
const path = "/graphql";

export const startServer = async () => {
  const server = new ApolloServer({
    schema: genSchema(),
    context: ({ req }: any) => ({
      req,
      pubsub,
      userLoader: userLoader()
    })
  });

  app.use(authMiddleware);

  app.use("/images", express.static("images"));

  // - - Cloudinary & Multer - -
  const cloudinary = require("cloudinary");
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  app.post("/image/upload", upload.single("photo"), (req: any) => {
    console.log(req.file.path);
    cloudinary.uploader.upload(req.file.path, function(result: any) {
      console.log(result);
    });
  });
  // - - End Cloudinary & Multer - -

  server.applyMiddleware({ app, path });
  const port = process.env.PORT || 4000;

  await createConnection();

  await app.listen({
    port
  });

  console.log(`Server is running on localhost:${port}${server.graphqlPath}`);
};
