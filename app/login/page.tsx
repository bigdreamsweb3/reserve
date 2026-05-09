import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect(user.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <main className="admin-shell min-h-screen px-5 py-16 lg:px-8">
      <AuthForm mode="login" />
    </main>
  );
}
