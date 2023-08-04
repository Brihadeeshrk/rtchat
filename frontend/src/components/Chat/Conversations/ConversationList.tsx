import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import ConversationModal from "./Modal";

interface ConversationListProps {
  session: Session;
}

const ConversationList: React.FC<ConversationListProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Flex width="100%">
      <Flex
        align="center"
        justify="center"
        py={2}
        px={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <Icon as={BiSearch} mr={3} />
        <Text
          fontSize="15px"
          _selection={{ bg: "none" }}
          color="whiteAlpha.800"
          fontWeight={500}
        >
          Find or start a conversation
        </Text>
      </Flex>

      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};
export default ConversationList;
