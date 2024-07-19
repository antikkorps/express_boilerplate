import { Request, Response } from "express";
import { registerUser, authenticateUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user = await registerUser(email, password, name);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  if (user) {
    req.login(user, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).json(user);
    });
  } else {
    res.status(401).send("Invalid credentials");
  }
};
