import userOperations from "@/graphql/operations/user";
import {
  SearchUsernameData,
  SearchUsernameVariables,
  SearchedUser,
} from "@/util/types";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
  Stack,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import UserSearchList from "./UserSearchList";
import Participants from "./Participants";
import toast from "react-hot-toast";

interface indexProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<indexProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  // the useQuery hook will be called as soon as this component is mounted to the DOM
  // which doesnt make sense right, why will we search for users when the user hasnt even entered a username, right?
  // so we need a bit more control as to when this query is going to fire

  // const { data, loading, error } = useQuery(userOperations.Queries.searchUsers);
  // and to solve this, we have another hook we can use called, useLazyQuery
  // with useLazyQuery we can choose exactly when we want this query to fire

  // the syntax for useLazyQuery is very much like useMutation

  /*
  useLazyQuery<x,y>(query)
  x => the structure of data that is being returned
  y => the structure of the data to be provided as a param
  */
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsernameData,
    SearchUsernameVariables
  >(userOperations.Queries.searchUsers);

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    // even though this function is querying the db, there is no need to make this async and the asynchronicity is handled by the useLazyQuery hook
    // as it provides us with the loading, error and data vars
    event.preventDefault();
    console.log("inside onSearch");
    searchUsers({ variables: { username } });

    console.log("THIS IS RESPONSE", data, loading, error);
  };

  const addParticipant = (user: SearchedUser) => {
    if (participants.some((participant) => participant.id === user.id)) {
      return;
    }
    setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((item) => item.id !== userId));
  };

  const onCreateConversation = async () => {
    try {
      // call createConversation mutation
    } catch (error: any) {
      console.log("onCreateConversation error", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Button
                  isLoading={loading}
                  type="submit"
                  isDisabled={!username}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
                participants={participants}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  _hover={{ bg: "brand.100" }}
                  onClick={() => {}}
                >
                  Start Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ConversationModal;
