import * as shortid from "shortid";
import * as fs from "fs";

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

export const processUpload = async (upload: any) => {
  const host = "http//localhost:4000/images/";

  const { stream } = await upload;

  const { id } = await storeUpload({ stream });
  return `${host}${id}`;
};
