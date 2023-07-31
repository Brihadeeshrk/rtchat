// creating a file for each entity and putting the operation strings for that entity here
import { gql } from "@apollo/client";

const userOperations = {
  Queries: {},
  Mutations: {
    createUsername: gql`
      # The Difference between a REST API and a graphQL API is that,
      #   In GraphQL, we can specify the variables we want in return after the operation, as opposed to in REST where we just get all the data
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  Subscriptions: {},
};

export default userOperations;
