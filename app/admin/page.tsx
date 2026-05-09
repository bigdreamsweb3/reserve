import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin-dashboard";
import { getSessionUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminDashboard />;
}
