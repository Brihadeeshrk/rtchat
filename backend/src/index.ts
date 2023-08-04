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
import { GraphQLContext, Session, SubscriptionContext } from "./util/types";
import { PrismaClient } from "@prisma/client";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

async function main() {
  // initialising to use ENV files
  dotenv.config();

  const app = express();
  const httpServer = createServer(app);
  // this is the websocket link
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });

  // package used to create an executable schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  /*
  Context Params
  */
  const prisma = new PrismaClient();
  // this is a publisher-subscriber functionality, as we are subscribing to the events in this chat and are receiving notifs as such
  const pubsub = new PubSub();

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer(
    {
      schema,
      // establishing the subs context which is of type graphQL contxt, as in it will have the same vars
      // we're checking if a user is logged in, if they are, session is a part of the context along with prisma
      // else it is null
      context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams && ctx.connectionParams.session) {
          const { session } = ctx.connectionParams;

          return { session, prisma, pubsub };
        }
        return { session: null, prisma, pubsub };
      },
    },
    wsServer
  );

  // creating the apollo server
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
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

      // this is an async fn so its going to return a PROMISE and its going to contain an object of type GraphQLContext
      context: async ({ req }): Promise<GraphQLContext> => {
        // the client app sends us the auth headers necessary for validation, this is passed ot the getSession() and this returns the currently logged in user

        // after adding prisma to our context, now all our resolvers can interact with the db
        const session = (await getSession({ req })) as Session | null;
        //  getSession returns a type of Session from next-auth, but the type of variable we intend to use in context is our own
        //
        return { session, prisma, pubsub };
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
