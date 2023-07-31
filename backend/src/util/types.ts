import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";

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
