//type declaration file
import "next-auth";

// the name of this file is the SAME as the type declaration file in the next-auth packages and this is what helps the compiler add more properties to the already existing interfaces

declare module "next-auth" {
  // by declaring the module 'next-auth' we're able to add custom properties to the next auth library and modify existing type interfaces that exist within the lib

  interface Session {
    user: User;
  }

  interface User {
    // this interface is going to be merged with the default User obj from next auth
    // we now add the properties that we wish to add separately
    id: string;
    username: string;
    image: string;
  }
}

// an important thing to note that, the interfaces we create here are going to be combines with their existing interfaces from the actual next-auth lib and this is why we don't have to explicitly mention the 'expires' property on the session obj
