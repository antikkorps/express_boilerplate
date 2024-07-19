import { findUserByEmail, createUser } from "../models/user";
import { hashPassword, comparePasswords } from "../utils/bcrypt";

export const registerUser = async (
  email: string,
  password: string,
  name: string,
) => {
  const hashedPassword = await hashPassword(password);
  return await createUser(email, hashedPassword, name);
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (user && (await comparePasswords(password, user.password))) {
    return user;
  }
  return null;
};
