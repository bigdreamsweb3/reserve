"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "signup";
  admin?: boolean;
};

export function AuthForm({ mode, admin = false }: AuthFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const isSignup = mode === "signup";

  return (
    <form
      className="admin-panel mx-auto max-w-xl rounded-[2rem] p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("");

        startTransition(async () => {
          try {
            const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
            const response = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
                isSignup ? { fullName, email, password } : { email, password },
              ),
            });

            const data = (await response.json()) as { message?: string; role?: string };

            if (!response.ok) {
              throw new Error(data.message ?? "Unable to continue.");
            }

            router.push(admin ? "/admin" : isSignup ? "/dashboard" : data.role === "admin" ? "/admin" : "/dashboard");
            router.refresh();
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to continue.");
          }
        });
      }}
    >
      <p className="eyebrow">{admin ? "Admin Access" : isSignup ? "Create Account" : "Welcome Back"}</p>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl text-[var(--ink)]">
        {admin ? "Admin login" : isSignup ? "Join Reserve" : "Login to Reserve"}
      </h1>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
        {admin
          ? "Sign in with an admin account to manage reserves, uploads, and booking statuses."
          : isSignup
            ? "Create your account to track bookings, stays, and hospitality activity."
            : "Sign in to see your bookings, requests, and account activity."}
      </p>

      <div className="mt-6 grid gap-4">
        {isSignup ? (
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Full name"
            className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
          />
        ) : null}
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          type="email"
          className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
          className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="accent-button rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Please wait..." : isSignup ? "Create account" : "Login"}
        </button>
        <p className="text-sm text-[var(--ink-soft)]">{message}</p>
      </div>
    </form>
  );
}
