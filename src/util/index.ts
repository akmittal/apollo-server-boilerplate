import { isContext } from "vm";
import { ApolloError } from "apollo-server";

export const getJWTSecret = () => "This is super secret";

export const verifyAuth = (context: any) => {
  if (context.user) {
    return context.user;
  } else {
    throw new ApolloError("User not authenticated");
  }
};
