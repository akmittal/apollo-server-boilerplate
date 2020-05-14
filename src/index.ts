import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import { ApolloServer, gql } from "apollo-server";
import {
  handleUserSignup,
  handleUserLogin,
  handleGetUsers,
  verifyToken,
} from "./resolvers/user";
import { Request } from "express";
import { getLogger } from "./util";

const typeDefs = gql`
  type Query {
    login(username: String!, password: String!): String!
    users: [User]!
  }
  type Mutation {
    signUp(user: inputUser): User!
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
  }
  input inputUser {
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    password: String!
  }
`;

const resolvers = {
  Query: {
    login: handleUserLogin,
    users: handleGetUsers,
  },
  Mutation: {
    signUp: handleUserSignup,
  },
};

createConnection()
  .then(async (connection: Connection) => {
    // definition and your set of resolvers.
    getLogger().info("Connection established", connection.isConnected);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }: { req: Request }): Promise<object> => {
        const authToken = req.headers.authorization || "";
        try {
          const user = await verifyToken(authToken);
          return { user };
        } catch (e) {
          return { error: e };
        }
      },
    });

    // The `listen` method launches a web server.
    server.listen(4000).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((error) => console.log(error));
