import { ResolverMap } from "./../../../types/ResolverType";
import { User } from "../../../entity/User";

export const resolvers: ResolverMap = {
  Query: {
    users: _ => {
      return User.find({});
    }
  }
};
