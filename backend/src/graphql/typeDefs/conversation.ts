// all the typeDefns that are related to a conversation

const conversationTypeDefs = `#graphql

    type CreateConversationResponse {
        conversationId: String
    }

    type Mutation {
        createConversation(participantIds: [String]): CreateConversationResponse
    }
`;

export default conversationTypeDefs;
