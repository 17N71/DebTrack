/**
 * Auth helpers using NextAuth and Prisma User model.
 * Session from getServerSession; userId from session for all user-scoped operations.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

/** Returns the current session user or null (server-only). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
  };
}

/** Returns the current user's id. Throws if not authenticated (use in protected routes/actions only). */
export async function getDefaultUserId(): Promise<string> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  return user.id;
}
