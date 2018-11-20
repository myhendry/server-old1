import * as shortid from "shortid";
import * as fs from "fs";
import * as cloudinary from "cloudinary";

const storeUpload = async ({ stream }: any): Promise<any> => {
  // Generate Picture Filename and Path
  const id = shortid.generate();
  const path = `images/${id}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on("finish", () => resolve({ id, path }))
      .on("error", reject)
  );
};

export const cloudinaryUpload = async ({ stream }: any): Promise<string> => {
  console.log("stream upload gql ", stream);
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  cloudinary.uploader
    .upload_stream({ resource_type: "raw" }, function(error: any, result: any) {
      if (result) {
        console.log("result ", result);
      } else {
        console.log("error ", error);
      }
    })
    .end(stream.buffer);

  return `Test`;
};

export const processUpload = async (upload: any) => {
  const host = "http//localhost:4000/images/";

  const { stream } = await upload;

  await cloudinaryUpload({ stream });

  const { id } = await storeUpload({ stream });
  return `${host}${id}`;
};
