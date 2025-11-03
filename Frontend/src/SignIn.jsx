import React from "react";
import { SignIn as ClerkSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function SignIn() {
  return (
    <>
      <h2>Sign In</h2>
      <SignedIn>
        <p>You are already signed in. <a href="/dashboard">Go to dashboard</a></p>
      </SignedIn>

      <SignedOut>
    
        <ClerkSignIn path="/sign-in" routing="path" />
      </SignedOut>
    </>
  );
}
