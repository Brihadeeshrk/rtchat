import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from "express";
import http from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

// both of the params are very important graphql concepts
// when you're creating a graphql api, the most imp thing that you're going to need is a schema
// the schema is the structure of our API
// Every GraphQL server uses a schema to define the structure of data that clients can query

// inside of our schema, were going to define all of the datatypes that our graphql API can send/receive to/from our client and also inside our schema, we're going to have to define a structure for all our queries, mutations, subs fns that our API is able to do

// long story short, we're going to define the structure of all of our types, entity or user as well as operation types such as queries, mutations and subscriptions
//  a schema's main purpose is to make sure the API is typesafe and is one of the main benefits of using graphql
async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((res) => httpServer.listen({ port: 4000 }, res));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

main().catch((err) => console.log(err));
