import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { getSessionUser } from "@/lib/auth";

export default async function AdminLoginPage() {
  const user = await getSessionUser();

  if (user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="admin-shell min-h-screen px-5 py-16 lg:px-8">
      <AuthForm mode="login" admin />
    </main>
  );
}
