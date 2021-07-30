import { User } from "./../entity/User";
import { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { getJWTSecret, verifyAuth, getLogger } from "./../util";
import { ApolloError } from "apollo-server";
import {IFieldResolver} from "graphql-tools";

export const handleUserLogin: IFieldResolver<unknown, unknown> = async (
  parent,
  args,
  context,
  info
) => {
  const { username, password } = args;
  getLogger().info({ parent, args, context, info });
  const user = await User.findOne({ where: { username } });
  try {
    if (!user) {
      throw "Invalid username";
    }
    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw "Invalid password";
    }
    const token = jwt.sign(user.toJSON(), getJWTSecret(), {
      algorithm: "HS256",
    });
    return token;
  } catch (e) {
    return new ApolloError(e.toString());
  }
};

export const handleUserSignup: IFieldResolver<unknown, unknown> = async (
  parent,
  args,
  context,
  info
) => {
  try {
    getLogger().info({ parent, args, context, info });
    const { username, password, email, firstName, lastName } = args.user;
    const user = new User(username, password, email, firstName, lastName);
    const r = await user.save();
    return r.toJSON();
  } catch (e) {
    return new ApolloError(e.toString());
  }
};

export const verifyToken = async (token: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getJWTSecret(), (err: Error, decoded: unknown) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};

export const handleGetUsers: IFieldResolver<unknown, Record<string, Record<string, unknown>>> = async (
  parent,
  args,
  context,
  info
) => {
  try {
    getLogger().info({ parent, args, context, info });
    verifyAuth(context);
    const users = await User.find({});
    return users;
  } catch (e) {
    return new ApolloError(e.toString());
  }
};
