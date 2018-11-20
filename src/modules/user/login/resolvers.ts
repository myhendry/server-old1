import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { ResolverMap } from "./../../../types/ResolverType";
import { User } from "../../../entity/User";

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("Login Failed");
      }

      const userAuthenticated = await bcrypt.compare(password, user.password);

      if (!userAuthenticated) {
        throw new Error("Login Failed");
      }

      const token = jwt.sign(
        {
          id: user.id
        },
        process.env.JWT_SECRET as string
      );

      return { token };
    }
  }
};
