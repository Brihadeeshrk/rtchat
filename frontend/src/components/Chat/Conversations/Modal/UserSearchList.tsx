import { SearchedUser } from "@/util/types";
import React from "react";

interface UserSearchListProps {
  users: Array<SearchedUser>;
}

const UserSearchList: React.FC<UserSearchListProps> = ({ users }) => {
  return <div>{users.length}</div>;
};
export default UserSearchList;
