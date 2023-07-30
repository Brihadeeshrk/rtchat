import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Session } from "next-auth";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";

type indexProps = {
  session: Session | null;
  // session could be null in case the user isn't logged in
  reloadSession: () => void;
  // re-fetches the user and the session from the db after the user successfully enters the username and submits
};

const Auth: React.FC<indexProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");

  const onSubmit = async () => {
    // we need to use a GraphQL Mutation here
    // Mutations are used to create, update or delete resources
    // and in this case we are updating the 'User' resource by adding a username
    // so here, we create a mutation called createUsername
    // for now, a simple try-catch block here, but eventually a server will be built
    try {
      // createUsername mutation to send our username to the GraphQL API
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
