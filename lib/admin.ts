import { getSessionUser } from "@/lib/auth";

export async function isAdminAuthorized(request: Request) {
  const adminKey = process.env.ADMIN_ACCESS_KEY;

  if (adminKey && request.headers.get("x-admin-key") === adminKey) {
    return true;
  }

  const sessionUser = await getSessionUser();
  return sessionUser?.role === "admin";
}
