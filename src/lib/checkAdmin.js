import User from "@/models/User";

export const isAdmin = async (userId) => {
  const user = await User.findById(userId);
  return user?.isAdmin || false;
};