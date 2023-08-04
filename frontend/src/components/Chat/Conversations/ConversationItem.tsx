import React from "react";
import { ConversationPopulated } from "../../../../../backend/src/util/types";
import { Stack, Text } from "@chakra-ui/react";

interface ConversationItemProps {
  conversation: ConversationPopulated;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
}) => {
  return (
    <Stack
      _hover={{ bg: "whiteAlpha.200" }}
      p={4}
      cursor={"pointer"}
      borderRadius={4}
    >
      <Text>{conversation.id}</Text>
    </Stack>
  );
};
export default ConversationItem;
