import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { ResolverMap } from "./../../../types/ResolverType";
import { User } from "../../../entity/User";

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, { email, password, name, age }) => {
      try {
        const userExists: User | undefined = await User.findOne({
          where: { email },
          select: ["id"]
        });

        if (userExists) {
          throw new Error("User already exists");
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);

        const user = await User.create({
          name,
          age,
          email,
          password: hashedPassword
        }).save();

        const token = jwt.sign(
          {
            id: user.id
          },
          process.env.JWT_SECRET as string
        );

        return { token };
      } catch (error) {
        throw error;
      }
    }
  }
};
