// here we're going to create all our user related resolvers
/* 
a resolver can be one of 3 things: 
a QUERY resolver
a MUTATION resolver
a SUBSCRIPTION resolver 
*/

import { GraphQLContext, createUsernameResponse } from "../../util/types";

// the typeDefs and the resolvers combine to give the structure of the graphQL API
// the resolvers for Query and Mutation were taken from the typeDef file: graphql/typeDefs/user
// we will write out the logic in here

const userResolvers = {
  Query: {
    // all of our user related query resolvers
    searchUsers: () => {},
  },
  Mutation: {
    // all of our user related mutation resolvers

    /* all mutations are passed 4 args IN THIS PARTICULAR ORDER
    parent: the return value of this resolver's parent (not imp in this case)

    args: an obj that contains all the args provided for this mutation (imp)

    context: an obj that is shared across ALL resolvers for a particular operation, typically used to share auth info among all operations (imp)

    info: contains info on the ops execution state (not imp)
    */

    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<createUsernameResponse> => {
      // convention: if there are args that you dont need or arent going to use, you can just declare them as '_' to indicate that youre not really doing anything with them
      // the type for args varies from resolver to resolver, in this particular case, we expect a username of type string
      // we need to create an interface for the context called GraphQLContext, when we deal with contextx, but for now we can just say any and we'll update this later
      // and we dont really need info, so we'll omit that

      // destructuring username from args
      const { username } = args;
      const { session, prisma } = context;

      // in order to set the username for a particular user, we need the currently logged in user and a way to communicate with the db
      // and this is where, we use next auth sessions

      // in the front end, we do this using prisma
      // we'll do the same thing here

      // WRITING LOGIC
      if (!session?.user) {
        // if there is no user signed in, return
        return {
          error: "Not Authorised",
        };
      }

      // getting the currently logged in users id
      const { id: userId } = session.user;

      try {
        // check if username is not taken
        // prisma will convert this query into a query suitable to the db its connecting to, so in this case it will convert this to a query that will work on mongoDB

        // due to js short hand operation, we can just put username and check the db for unique fields
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUser) {
          return {
            error: "Username already taken. try another",
          };
        }

        // updating the record for the user with id (from context) and setting his username to username (from args)
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return {
          success: true,
        };
      } catch (error: any) {
        console.log("createUsername resolver error", error);
        // return the error to the front end
        return {
          error: error?.message,
        };
      }
    },
  },
  // Subscription: {},
};

export default userResolvers;
