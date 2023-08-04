// here we initialise the apollo client instance
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

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

/*
in order to get our application fully setup with websockets in order to perform SUBSCRIPTIONS, we need to make a few adjustments to our apollo-client and our server
*/

/*
all we're doing in this file is creating a websocket link and what is called a SPLITLINK, and were taking BOTH the websocket link and the HTTP link and then creating this SPLIT LINK that the apollo client can then determine which graphql endpoint to use depending on the type of req our client is making

in case our client is making a http req, like our conversation query or search users query, the apollo client is going to use the http link
but for any websocket req, such as createConvo and any real-time functionality, we're going to use the websocket link
*/

/*
since we're using next js, we're going to have to make a few changes due to the server side rendering pattern of next js
so we're going to have to make sure, that the WINDOW obj is defined and we are on the browser and not on the server
*/

// wsLink will be null if we're on the server
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "ws://localhost:4000/graphql/subscriptions",
        })
      )
    : null;

// in this snippet, we check if the type of req is a WS req, then we return the WsLink or we return the httpLink
const link =
  typeof window !== "undefined" && wsLink !== null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  //   Apollo has in built caching, so it caches the results of all queries we make so that it doesn't perform unnecessary req to the API
});
