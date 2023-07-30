import React from "react";
import { signIn } from "next-auth/react";

type indexProps = {};

const Auth: React.FC<indexProps> = () => {
  return (
    <div>
      AUTH
      <button onClick={() => signIn("google")}>Sign In</button>
    </div>
  );
};
export default Auth;
