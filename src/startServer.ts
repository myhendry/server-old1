import "reflect-metadata";
import "dotenv/config";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { createServer } from "http";
// import * as graphqlHTTP from "express-graphql";
const graphqlHTTP = require("express-graphql");
// import { graphqlUploadExpress } from "graphql-upload";
// tslint:disable-next-line
const { graphqlUploadExpress } = require("graphql-upload");
import * as cors from "cors";
require("dotenv").config();

import { pubsub } from "./utils/pubsub";
// import { upload } from "./utils/uploadImageRest";
import { genSchema } from "./utils/genSchema";
import { authMiddleware } from "./utils/middlewares";
import { userLoader } from "./loaders/userLoader";

//! Using Apollo Server Express
const app = express();
const path = "/graphql";
const schema = genSchema();

export const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => ({
      req,
      pubsub,
      userLoader: userLoader()
    })
  });

  app.use(cors());

  app.use(authMiddleware);

  app.use("/images", express.static("images"));

  app.use(
    "graphql",
    graphqlUploadExpress({
      uploadDir: "/",
      maxFileSize: 100000000,
      maxFiles: 10
    }),
    graphqlHTTP({ schema }) as any
  );

  // app.get("/", (_, res) => {
  //   res.sendFile(__dirname + "/index.html");
  // });

  // - - Cloudinary & Multer - -
  // const cloudinary = require("cloudinary");
  // cloudinary.config({
  //   cloud_name: process.env.cloud_name,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET
  // });

  // app.post("/image/upload", upload.single("photo"), (req: any) => {
  //   console.log(req.file.path);
  //   cloudinary.uploader.upload(req.file.path, function(result: any) {
  //     console.log(result);
  //   });
  // });
  // - - End Cloudinary & Multer - -

  server.applyMiddleware({ app, path });

  //! Added Subscription Handler
  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  const port = process.env.PORT || 4000;

  await createConnection();

  // const io = require("socket.io")(httpServer);

  // io.on("connection", (socket: any) => {
  //   console.log("connected", socket.id);
  //   socket.on("update", () => io.emit("update"));
  // });

  await httpServer.listen({
    port
  });

  console.log(`Server is running on localhost:${port}${server.graphqlPath}`);
};
