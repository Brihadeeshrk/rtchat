import { SearchedUser } from "@/util/types";
import React from "react";

interface ParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  removeParticipant,
}) => {
  return <div>Have a good coding</div>;
};
export default Participants;
