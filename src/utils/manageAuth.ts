import { User } from "./../entity/User";

export const requireAuth = async (user: User) => {
  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  const me = await User.findOne({ where: { id: user.id } });

  if (!me) {
    throw new Error("Unauthorized");
  }

  return me;
};
