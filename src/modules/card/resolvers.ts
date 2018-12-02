import { Card } from "./../../entity/Card";
import { ResolverMap } from "../../types/ResolverType";

export const resolvers: ResolverMap = {
  Query: {
    cards: _ => {
      return Card.find({});
    }
  },
  Mutation: {
    createCard: async (_, { nickName }) => {
      const card = await Card.create({ nickName }).save();
      console.log(card);
      return card;
    }
  }
};
