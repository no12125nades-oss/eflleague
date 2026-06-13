import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode("efl-local-auth-secret-key-2026");

async function createToken(userId: number, role: string): Promise<string> {
  return new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

async function verifyToken(token: string): Promise<{ userId: number; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { clockTolerance: 60 });
    return payload as { userId: number; role: string };
  } catch {
    return null;
  }
}

export { verifyToken };

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        username: z.string().min(3).max(100),
        password: z.string().min(4).max(100),
        displayName: z.string().min(1).max(255).optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [existing] = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username));

      if (existing) {
        throw new Error("Username already taken");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const [result] = await db.insert(localUsers).values({
        username: input.username,
        password: hashedPassword,
        displayName: input.displayName || input.username,
        email: input.email,
      });

      const userId = Number(result.insertId);
      const token = await createToken(userId, "user");

      return { token, userId };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [user] = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username));

      if (!user) {
        throw new Error("Invalid username or password");
      }

      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) {
        throw new Error("Invalid username or password");
      }

      const token = await createToken(user.id, user.role);
      return { token, userId: user.id, role: user.role };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const token =
      ctx.req.headers.get("x-local-auth-token") ||
      new URL(ctx.req.url).searchParams.get("localAuthToken");

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const db = getDb();
    const [user] = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.id, payload.userId));

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
      avatar: user.avatar,
      statsKd: user.statsKd,
      statsRating: user.statsRating,
      statsMaps: user.statsMaps,
    };
  }),

  updateProfile: publicQuery
    .input(
      z.object({
        displayName: z.string().optional(),
        email: z.string().email().optional(),
        teamId: z.number().optional(),
        avatar: z.string().optional(),
        statsKd: z.number().optional(),
        statsRating: z.number().optional(),
        statsMaps: z.number().optional(),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { token, ...data } = input;
      const payload = await verifyToken(token);
      if (!payload) throw new Error("Invalid token");

      const db = getDb();
      const updateData: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(data)) {
        if (val !== undefined) updateData[key] = val;
      }

      await db
        .update(localUsers)
        .set(updateData as typeof localUsers.$inferInsert)
        .where(eq(localUsers.id, payload.userId));

      return { success: true };
    }),

  listUsers: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select({
        id: localUsers.id,
        username: localUsers.username,
        displayName: localUsers.displayName,
        role: localUsers.role,
        teamId: localUsers.teamId,
        createdAt: localUsers.createdAt,
      })
      .from(localUsers);
  }),
});
