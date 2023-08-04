// all the typeDefns that are related to a user

const userTypeDefs = `#graphql
  # we can declare an entity type in a graphQL string using the keyword type followed by the name of the entity

  # inside of these {} we can declare all of the fields the user is going to have as well as the types of these fields

  type User {
    id: String
    name: String
    username: String
    email: String
    emailVerified: Boolean
    image: String
  }

  type SearchedUser {
    id: String
    username: String
  }

  # not only are we declaring our entities in here, we're also going to be declaring our queries, mutations and subscriptions

  # to declare a query
  # an operation where we are reading data
  # it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    searchUsers(username: String): [SearchedUser]
  }

  # In this case, the "searchUsers" query returns an array of zero or more Users (defined above).

  # to declare a mutation
  # are WRITE operations

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }

  type Mutation {
    createUsername(username: String): CreateUsernameResponse
  }
`;

export default userTypeDefs;
