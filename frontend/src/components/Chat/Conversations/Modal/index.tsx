import userOperations from "@/graphql/operations/user";
import {
  CreateConversationData,
  CreateConversationVariables,
  SearchUsernameData,
  SearchUsernameVariables,
  SearchedUser,
} from "@/util/types";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";
import conversationOperations from "@/graphql/operations/conversation";
import { Session } from "next-auth";

interface indexProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal: React.FC<indexProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);

  // extracting the userId
  const {
    user: { id: userId },
  } = session;

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
  //  Aliasing the variables so that the variables form the useLazyQuery and the useMutation don't cause naming conflicts
  const [
    searchUsers,
    { data: userData, loading: userLoading, error: userError },
  ] = useLazyQuery<SearchUsernameData, SearchUsernameVariables>(
    userOperations.Queries.searchUsers
  );

  //  Aliasing the variables so that the variables form the useLazyQuery and the useMutation don't cause naming conflicts
  // only extracting loading from here, as we can obtain the data and the errors from when we call this function
  const [createConversation, { loading: conversationLoading }] = useMutation<
    CreateConversationData,
    CreateConversationVariables
  >(conversationOperations.Mutations.createConversation);

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    // even though this function is querying the db, there is no need to make this async and the asynchronicity is handled by the useLazyQuery hook
    // as it provides us with the loading, error and data vars
    event.preventDefault();
    searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    // if the participant is already added to the state[] then return
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
    const participantIds = [
      userId,
      ...participants.map((participant) => participant.id),
    ];
    try {
      const { data } = await createConversation({
        variables: {
          participantIds: participantIds,
        },
      });

      console.log("HERE IS THE NEW DATA", data);
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
                  isLoading={userLoading}
                  type="submit"
                  isDisabled={!username}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {userData?.searchUsers && (
              <UserSearchList
                users={userData.searchUsers}
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
                  onClick={onCreateConversation}
                  isLoading={conversationLoading}
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
