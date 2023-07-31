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

async function main() {
  dotenv.config();

  const app = express();
  const httpServer = createServer(app);

  // package used to create an executable schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
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
