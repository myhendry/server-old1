import { requireAuth } from "./../../../utils/manageAuth";
import { ResolverMap } from "./../../../types/ResolverType";

export const resolvers: ResolverMap = {
  Query: {
    me: async (_, __, { req }) => {
      const user = req.user;
      console.log(user);
      try {
        const me = await requireAuth(user);

        return me;
      } catch (error) {
        throw error;
      }
    }
  }
};
