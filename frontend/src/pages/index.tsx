import Head from "next/head";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data } = useSession();

  console.log(data);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <button onClick={() => signIn("google")}>sign in</button>
        {data?.user && <button onClick={() => signOut()}>sign out</button>}
      </div>
    </>
  );
}
