import { SearchedUser } from "@/util/types";
import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface UserSearchListProps {
  users: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
  participants: Array<SearchedUser>;
}

const UserSearchList: React.FC<UserSearchListProps> = ({
  users,
  addParticipant,
  participants,
}) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center">
          <Text>No users found</Text>
        </Flex>
      ) : (
        <>
          <Stack mt={6}>
            {users.map((user) => (
              <Stack
                transition="0.4s"
                direction="row"
                key={user.id}
                align="center"
                spacing={4}
                py={2}
                px={4}
                borderRadius={4}
                _hover={{ bg: "whiteAlpha.200" }}
              >
                <Avatar src="" />
                <Flex align={"center"} justify="space-between" width="100%">
                  <Text color={"whiteAlpha.700"}>{user.username}</Text>
                  {participants.some(
                    (participant) => participant.id === user.id
                  ) ? (
                    <Button
                      bg={"brand.200"}
                      color={"black"}
                      _hover={{ bg: "brand.200" }}
                      onClick={() => addParticipant(user)}
                    >
                      Added
                    </Button>
                  ) : (
                    <Button
                      bg={"brand.100"}
                      _hover={{ bg: "brand.100" }}
                      onClick={() => addParticipant(user)}
                    >
                      Chat
                    </Button>
                  )}
                </Flex>
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </>
  );
};
export default UserSearchList;
