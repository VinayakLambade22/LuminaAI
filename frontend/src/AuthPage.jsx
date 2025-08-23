import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { useState } from "react";
import "./AuthPage.css";

function AuthPage() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <SignedOut>
        {open && (
          <div className="authOverlay">
            <div className="authModal">
              <img
                src="/blacklogo.png"
                alt="LuminaAI Logo"
                className="authLogo"
              />

              <h1 className="authTitle">Welcome to LuminaAI</h1>
              <p className="authSubtitle">
                Sign in or sign up to access your personalized AI assistant
              </p>

              <div className="authButtons">
                <SignInButton mode="modal">
                  <button className="loginBtn">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="signupBtn">Sign up</button>
                </SignUpButton>
              </div>

              <div className="authFooter">
                <p>Your conversations are private and secure</p>
              </div>
            </div>
          </div>
        )}
      </SignedOut>

      <SignedIn></SignedIn>
    </>
  );
}

export default AuthPage;
