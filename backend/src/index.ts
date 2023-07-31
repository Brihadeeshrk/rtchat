import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import cors from "cors";
import { json } from "body-parser";
import typeDefs from "./graphql/typeDefs/index";
import resolvers from "./graphql/resolvers/index";
import { makeExecutableSchema } from "@graphql-tools/schema";
import * as dotenv from "dotenv";
import { createServer } from "http";
import { getSession } from "next-auth/react";

async function main() {
  // initialising to use ENV files
  dotenv.config();

  const app = express();
  const httpServer = createServer(app);

  // package used to create an executable schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // creating the apollo server
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // options to handle cors, otigin can be an array of url's
  // such as [process.env.CLIENT_ORIGIN, process.env.PROD_ORIGIN, ...]
  // credentials is set to true to permit the use of credentials in the server
  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  await server.start();

  // context for the server is dealt here, for more info on context go to graphql/resolvers/user
  // the context is a callback fn that is going to be called when the client first communicates with the server and its going to be async
  // and it is through this callback fn that our client is going to send imp info to the server and that is why credentials is set to TRUE in corsOptions
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      // the req obj is going to contain the header info provided by next-auth using a fn called getSession()
      // point is to put info in here that is required and essential to all resolvers
      // 1 - User Session
      // 2 - Prisma Client that is used to communicate with db
      // 3 - Pubsub (not imp rn)
      context: async ({ req }) => {
        // the client app sends us the auth headers necessary for validation, this is passed ot the getSession() and this returns the currently logged in user
        const session = await getSession({ req });
        // console.log("CONSOLE SESSION", req);
        return { session };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}/graphql`
  );
}

main().catch((err) => console.log("ERROR IN src/index.ts/MAIN", err));

// when building a graphql API, the most important thing we're going to need is a schema
// a graphql schema is basically a structure of our graphQL API
// Inside of our schema, we're going to define all of our data types our graphQL API can send/receive to/from our client app
// inside our schema we're going to have to define a structure for all our queries, mutation and subscription fns that we should be able to do
// long story short, we're going to have to define the structure of all types, entity types such as User, Conversation or Operation Types such as QUERY, MUTATION, SUBSCRIPTION
// the main purpose of our schema is to ensure that our API is typesafe
