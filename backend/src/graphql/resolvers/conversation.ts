import { GraphQLContext } from "../../util/types";

const conversationResolvers = {
  //   Query: {},
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<String> },
      context: GraphQLContext
    ) => {
      const { participantIds } = args;
      console.log("THESE ARE THE PARTICIPANT IDS", participantIds);
      console.log("INSIDE CREATECONVERSATION");
    },
  },
  // Subscriptions: {}
};

export default conversationResolvers;
