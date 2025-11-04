import { User } from "./User.model";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export const findUserById = async (id: unknown) => {
  return await User.findByPk(id as string);
};

export const createUser = async (
  email: string,
  password: string,
  name: string,
) => {
  return await User.create({ email, password, name });
};
