import { ApolloError } from "apollo-server";
import * as pino from "pino";

const logger = pino();

export const getJWTSecret = (): string => "This is super secret";

export const verifyAuth = (context: Record<string, object>): object => {
  if (context.user) {
    return context.user;
  } else {
    throw new ApolloError("User not authenticated");
  }
};

export const getLogger = (): pino.Logger => {
  return logger;
};
