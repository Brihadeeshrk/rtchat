// here we initialise the apollo client instance
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// this is the graphQL endpoint that is going to allow us to send http req to our server
// when we get to real-time data such as subscriptions, we need to create a websocket
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  /*
    difference between graphQL API and a REST API is that,
    REST API's have multiple endpoints to get specific data but in GraphQL,
    every single req made to the server is sent to this one graphQL endpoint 
    and at this endpoint, we are going to define 'resolvers' that are functions that are similar to endpoints in the sense that each req made to the endpoint will call a particular resolver fn to get or store the appropriate data
    depending on the type of operation, whether a query, mutation or a subscription
  */
  credentials: "include",
  /*
    important for authorisation and CORS
  */
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  //   Apollo has in built caching, so it caches the results of all queries we make so that it doesn't perform unnecessary req to the API
});
