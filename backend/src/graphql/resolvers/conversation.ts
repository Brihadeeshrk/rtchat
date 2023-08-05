import { GraphQLError, subscribe } from "graphql";
import { ConversationPopulated, GraphQLContext } from "../../util/types";
import { Prisma } from "@prisma/client";

const conversationResolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { prisma, session } = context;

      if (!session?.user) {
        // if there is no user signed in, return
        throw new GraphQLError("Not authorised");
      }

      const {
        user: { id: userId },
      } = session;

      try {
        /*
        the following code is correct with respect to syntax and query logic
        the reason it doesnt work is due to a suspected bug in the prisma mongo adapter

        const conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              // find conversations with participants where SOME of the users in these conversations match the userId of the signed in user
              some: {
                userId: {
                  equals: userId,
                },
              },
            },
          },
          include: conversationPopulated,
        });
        */

        // since the above code wouldnt work, we're going to fetch all the conversations and filter through them and return that array back to the front end

        const conversations = await prisma.conversation.findMany({
          include: conversationPopulated,
        });

        return conversations.filter(
          (convo) => !!convo.participants.find((user) => user.userId === userId)
        );
      } catch (error: any) {
        console.log("ERROR WHILE FETCHING CONVERSATIONS", error);
        throw new GraphQLError("Error fetching conversations");
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { participantIds } = args;
      const { prisma, session, pubsub } = context;
      //  the conversation entity is going to have some relationship with other entities such as Users, and Messages
      // we need to know which users are part of which conversation and which messages are part of which conversation
      // before we can create such a conversation, we need to make some updates to our schema, so that when we create this conversation, the necessary relations are formed among the other entities

      if (!session?.user) {
        // if there is no user signed in, return
        throw new GraphQLError("Not authorised");
      }

      // extract the current user's id
      const {
        user: { id: userId },
      } = session;

      try {
        // when we create a new convo, at the same time we need to create a conversation participant for every participant who is in this conversation
        const conversation = await prisma.conversation.create({
          // the data we are going to store in this document
          data: {
            // modifying the participants field which is of type ConversationParticipant
            participants: {
              // as mentioned, we need to create a ConversationParticipant for everyone involved in the conversation, so for that we use createMany
              createMany: {
                // what should the value of this be? so if we check ConversationParticipant, other than the the foreign key variables and their relations
                // we need to set the obtain the conversationId to set it
                // so, whats left is userId and hasSeenLatestMessage

                // right now, the participantIds array is of type SearchedUser
                /*
                ie, it has a username field as well, that we don't need here, so we can't pass the array as it is, so we map through it and collect only the ids
                and, for every record, we set the hasSeenLatestMessage
                */

                // obviously, if we are the ones who have started the convo, we know the latest message, so it is set to true for us
                // and false for others
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId,
                })),
              },
            },
          },
          // here we're telling prisma what details we want back AFTER creating the conversation
          // basically, all the data we'll need in the front end
          include: conversationPopulated,
        });

        // emit a CONVERSATION_CREATED pubsub event
        /**
         * pubsub.publish(arg1, arg2) syntax
         * arg1 - name of the event were publishing
         * arg2 - data (payload)
         *
         * and this will call the Subscription resolver below
         */
        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: conversation,
        });

        return { conversationId: conversation.id };
      } catch (error: any) {
        console.log("createConversation error", error);
        throw new GraphQLError("Error creating conversation");
      }
    },
  },
  Subscription: {
    conversationCreated: (_: any, __: any, context: GraphQLContext) => {
      const { pubsub } = context;
      // An AsyncIterator object listens for events that are associated with a particular label (or set of labels) and adds them to a queue for processing.

      // Every Subscription field resolver's subscribe function must return an AsyncIterator object.
      console.log("IN SUBSCRIPTION CONSOLE");
      return pubsub.asyncIterator(["CONVERSATION_CREATED"]);

      // now since our conversationCreated is listening to this event, this subscribe fn is going to fire whenever this createConversation is published
      // the whole goal of using a subscription, is to get the server to pass this newly created conversation entity to the client in REAL TIME as convos are created
      // for this, the client needs to subscribe to this SUBSCRIPTION
    },
  },
};

// we need to make sure this snippet is readable by prisma, which is why we use a prisma validator and since this includes fields from ConversationParticipant, we set the type to ConversationParticipantInclude
export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    // participants.user and enter true for the fields you want
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

// same as above, but here we set the type to ConversationInclude
export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    // return the participants
    participants: {
      include: participantPopulated,
    },
    // we also want the latest message, in case this is a new convo, then this would be null? but it would still help us in rendering the view
    latestMessage: {
      include: {
        sender: {
          // we include details of the sender of the message, their id and username
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default conversationResolvers;
