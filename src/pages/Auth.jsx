// src/pages/Auth.jsx
import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, pw);
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleGoogle = async () => {
    setErr("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#2F2F2F]">
      <div className="w-full max-w-md p-6 rounded-xl border border-[#D9D9D9] bg-white dark:bg-[#3a3a3a]">
        <h1 className="font-cormorant text-3xl mb-4 text-center">
          {isSignup ? "Create account" : "Welcome back"}
        </h1>

        {err && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3">{err}</p>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="submit"
            className="w-full rounded-full px-4 py-2 border border-[#A78E74] hover:bg-[#F0F0F0]"
          >
            {isSignup ? "Sign up" : "Log in"}
          </button>
        </form>

        <div className="my-4 text-center">— or —</div>

        <button
          onClick={handleGoogle}
          className="w-full rounded-full px-4 py-2 border border-[#A78E74] hover:bg-[#F0F0F0]"
        >
          Continue with Google
        </button>

        <p className="text-center mt-4 text-sm">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <button
            className="underline"
            onClick={() => setIsSignup((v) => !v)}
          >
            {isSignup ? "Log in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
