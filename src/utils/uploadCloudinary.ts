import * as cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryUpload = async ({ stream }: any): Promise<any> => {
  const streamLoad = cloudinary.v2.uploader.upload_stream(function(
    error: any,
    result: any
  ) {
    if (result) {
      console.log("result ", result);
    } else {
      console.log("error ", error);
    }
  });

  stream.pipe(streamLoad);

  return `Test`;
};

export const processCloudinaryUpload = async (upload: any) => {
  // const host = "http//localhost:4000/images/";

  const { stream } = await upload;

  await cloudinaryUpload({ stream });

  // const { id } = await storeUpload({ stream });
  // return `${host}${id}`;
};
