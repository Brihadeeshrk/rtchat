import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../util/types";
import { Prisma } from "@prisma/client";

const conversationResolvers = {
  //   Query: {},
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ) => {
      const { participantIds } = args;
      const { prisma, session } = context;
      //  the conversation entity is going to have some relationship with other entities such as Users, and Messages
      // we need to know which users are part of which conversation and which messages are part of which conversation
      // before we can create such a conversation, we need to make some updates to our schema, so that when we create this conversation, the necessary relations are formed among the other entities

      if (!session?.user) {
        // if there is no user signed in, return
        throw new GraphQLError("Not authorised");
      }

      const {
        user: { id: userId },
      } = session;

      try {
        // when we create a new convo, at the same time we need to create a conversation participant for every participant involved
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });
      } catch (error: any) {
        console.log("createConversation error", error);
        throw new GraphQLError("Error creating conversation");
      }
    },
  },
  // Subscriptions: {}
};

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default conversationResolvers;
