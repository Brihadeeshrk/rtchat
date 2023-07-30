// all of our user related resolvers
import userResolvers from "./user";
import merge from "lodash.merge";

// we need to use lodash to merge all the resolvers into 1
// we need to do this as all of our resolvers have repeating keys, Query, Mutation and Subscription and we need to make sure they are merged properly

// the first param is the destination obj, where all our merged resolvers end up
// all the other params are the resolvers we wish to merge
const resolvers = merge({}, userResolvers);

export default resolvers;
