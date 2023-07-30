import React from "react";
import { signOut } from "next-auth/react";

type indexProps = {};

const Chat: React.FC<indexProps> = () => {
  return (
    <div>
      CHAT
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};
export default Chat;
