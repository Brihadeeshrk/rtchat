import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import ConversationList from "./ConversationList";
import { useQuery } from "@apollo/client";
import conversationOperations from "@/graphql/operations/conversation";
import { ConversationsData } from "@/util/types";

interface ConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
  } = useQuery<ConversationsData, null>(
    conversationOperations.Queries.conversations
  );

  console.log(
    "HERE IS DATA",
    conversationsData,
    conversationsLoading,
    conversationsError
  );
  return (
    <Box px={3} py={6} width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50">
      {/* Skeleton Loader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
      />
    </Box>
  );
};
export default ConversationsWrapper;
