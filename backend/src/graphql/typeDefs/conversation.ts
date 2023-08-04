// all the typeDefns that are related to a conversation

const conversationTypeDefs = `#graphql

    type CreateConversationResponse {
        conversationId: String
    }

    type Mutation {
        createConversation(participantIds: [String]): CreateConversationResponse
    }

    # the type of this Conversation must be the same as the ConversationPopulated prisma.validator in src/resolvers/conversation
    # out of the box, graphql doesnt have a Date object, so we have to define something called a SCALAR in order to use date and time stamps in graphQL and this is as simple as using the keyword scalar and the varname Date
    scalar Date

    type Participant {
        id: String
        user: User
        hasSeenLatestMessage: Boolean
    }

    type Conversation {
        id: String
        latestMessage: Message
        participants: [Participant]
        createdAt: Date
        updatedAt: Date
    }

    # a query to return all the conversations the user is a part of 
    type Query {
        conversations: [Conversation]
    }
`;

export default conversationTypeDefs;
