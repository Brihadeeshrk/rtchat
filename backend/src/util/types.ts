import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/conversation";

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
  // pubsub
}

// CONVERSATIONS
// this will create a TS type for a query
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;
