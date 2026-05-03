import "server-only";

import { getAuth } from "@/lib/auth";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { user as userSchema } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getSession = async () => {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const session = await getAuth().api.getSession({ headers: await headers() });
  return session;
};

export const isAdmin = async (): Promise<boolean> => {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/login");
  }

  const userDataResults = await getDb()
    .select({ role: userSchema.role })
    .from(userSchema)
    .where(eq(userSchema.id, user.id))
    .limit(1);

  const userData = userDataResults[0];
  return !!userData && userData.role === "admin";
};
