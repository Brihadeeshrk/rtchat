// USER TYPES

export interface CreateUsernameVariables {
  username: string;
}

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface SearchUsernameVariables {
  username: string;
}

export interface SearchedUser {
  id: string;
  username: string;
}

export interface SearchUsernameData {
  // if you go to graphql/operations/user, we can observe that we're only extracting the username and the id of the user
  // so the type of entities are an array of {id, username}
  // we've just declared a separate type for this above as it is different from the User type
  searchUsers: Array<SearchedUser>;
}

// CONVERSATION TYPES

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationVariables {
  participantIds: string[];
}
