import { gql } from "@apollo/client";

const ConversationFields = `
  conversations {
    # from the conversations query, i want the id of the conversation
    id
    # from the participants field, i want the users' id and their username
    # nested obj properties
    participants {
      user {
        id
        username
      }
      # to render a blue dot alongside the chat in case they havent
      hasSeenLatestMessage
    }
    # because we need to sort the chat by recents
    updatedAt
    # we need the latest message in this chat and its id
    latestMessage {
      id
      # who sent the message? their id and username to display it on the left side
      sender {
        id
        username
      }
      # the content of the message
      body
      # when was the message sent? when was it created?
      createdAt
    }
  }
`;

const conversationOperations = {
  Queries: {
    conversations: gql`
      query Conversations {
        ${ConversationFields}
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
  },
  Subscriptions: {},
};

export default conversationOperations;
