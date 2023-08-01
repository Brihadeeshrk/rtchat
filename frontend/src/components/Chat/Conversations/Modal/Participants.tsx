import { SearchedUser } from "@/util/types";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

interface ParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  removeParticipant,
}) => {
  return (
    <Flex mt={8} gap={"10px"} flexWrap="wrap">
      {participants.map((item, index) => (
        <Stack key={index} direction="row" spacing={4}>
          <Flex
            align="center"
            bg="whiteAlpha.200"
            py={1}
            px={1}
            width="100%"
            borderRadius={4}
          >
            <Text>{item.username}</Text>
            <Icon
              cursor="pointer"
              ml={3}
              as={IoCloseCircleOutline}
              onClick={() => removeParticipant(item.id)}
            />
          </Flex>
        </Stack>
      ))}
    </Flex>
  );
};
export default Participants;
