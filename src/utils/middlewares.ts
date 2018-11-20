import { decodeToken } from "./manageToken";

export const authMiddleware = async (req: any, __: any, next: any) => {
  try {
    const token = req.headers.authorization;
    if (token != null) {
      const user = await decodeToken(token);
      req.user = user;
    } else {
      req.user = null;
    }
    return next();
  } catch (error) {
    throw error;
  }
};
