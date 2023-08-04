import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/conversation";
import { Context } from "graphql-ws/lib/server";
import { PubSub } from "graphql-subscriptions";

// USER
// createUsername
export interface createUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface User {
  // this interface is going to be merged with the default User obj from next auth
  // we now add the properties that we wish to add separately
  id: string;
  username: string;
  image: string;
  email: string;
  emailVerified: boolean;
  name: string;
}

export interface Session {
  user: User;
  expires: ISODateString;
}

// Context
export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

// context works a bit differently with subscriptions that it does with normal http requests
// we need to declare CONNECTION PARAMS for our subs and on those PARAMS were going to have our user session
/** The parameters passed during the connection initialisation.
 * one of the pieces of data that we want to send with this data is the next-auth user session
 * and these connectionParams are declared on the client side while intialising the connection, and these params will be available to all our subsription resolvers
 */
export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

// CONVERSATIONS
// this will create a TS type for a query
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;
