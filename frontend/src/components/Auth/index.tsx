import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Session } from "next-auth";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import userOperations from "@/graphql/operations/user";

type indexProps = {
  session: Session | null;
  // session could be null in case the user isn't logged in
  reloadSession: () => void;
  // re-fetches the user and the session from the db after the user successfully enters the username and submits
};

// right now, typescript doesn't know what structure our data might have or what structure of input the query needs, which is why we are building interfaces to enforce type safety and robustness
// without this, ONLY graphQL knows that username is to be taken as input, no one else knows this.
// and this is why we need to create TypeScript types to model graphQL types so our code is typesafe

/*
the data we get back from the createUsername fn
represents the structure of the data returned by the useMutation hook
it is going to have the name of the mutation and inside that, whatever we are extracting from the GQL query in operations/user
which in this case is a success bool and an error str
*/

interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

/*
the data we need to pass into the GQl query, which in this case is a username of type string
*/

interface CreateUsernameVariables {
  username: string;
}

const Auth: React.FC<indexProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");

  /*
  useMutation<x,y>
  x => the structure of data that is being returned
  y => the structure of the data to be provided as a param
  */

  const [createUsername, { data, loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(userOperations.Mutations.createUsername);

  const onSubmit = async () => {
    // we need to use a GraphQL Mutation here
    // Mutations are used to create, update or delete resources
    // and in this case we are updating the 'User' resource by adding a username
    // so here, we create a mutation called createUsername
    // for now, a simple try-catch block here, but eventually a server will be built
    try {
      // createUsername mutation to send our username to the GraphQL API
      await createUsername({ variables: { username: username } });
    } catch (error) {
      console.log("onSubmit Error");
    }
  };

  return (
    <>
      <Center height="100vh">
        <Stack spacing={8} align="center">
          {session ? (
            <>
              <Text fontSize="3xl">Create a Username</Text>
              <Input
                placeholder="Enter a username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <Button width="100%" onClick={onSubmit}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Text fontSize="3xl">RTChat</Text>
              <Button
                onClick={() => signIn("google")}
                leftIcon={
                  <Image
                    src="/assets/googlelogo.png"
                    height="20px"
                    alt="Google Logo"
                  />
                }
              >
                Continue with Google
              </Button>
            </>
          )}
        </Stack>
      </Center>
    </>
  );
};
export default Auth;
