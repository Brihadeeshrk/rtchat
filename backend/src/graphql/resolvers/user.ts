// here we're going to create all our user related resolvers
/* 
a resolver can be one of 3 things: 
a QUERY resolver
a MUTATION resolver
a SUBSCRIPTION resolver 
*/

// the typeDefs and the resolvers combine to give the structure of the graphQL API
// the resolvers for Query and Mutation were taken from the typeDef file: graphql/typeDefs/user
// we will write out the logic in here

export const userResolvers = {
  Query: {
    // all of our user related query resolvers
    searchUsers: () => {},
  },
  Mutation: {
    // all of our user related mutation resolvers
    createUsername: () => {},
  },
  // Subscription: {},
};
