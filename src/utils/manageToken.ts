import * as jwt from "jsonwebtoken";

export const decodeToken = (token: any) => {
  // console.log("token ", token);
  // const arr = token.split(" ");
  // console.log("arr", arr);

  return jwt.decode(token, process.env.JWT_SECRET as jwt.DecodeOptions);
  // if (arr[0] === "Bearer") {

  // }

  // throw new Error("Token invalid");
};
