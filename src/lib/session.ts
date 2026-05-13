import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  user?: string;
  loginAt?: number;
};

const password = process.env.SESSION_PASSWORD;
if (!password || password.length < 32) {
  throw new Error("SESSION_PASSWORD .env dosyasinda en az 32 karakter olmali.");
}

export const sessionOptions: SessionOptions = {
  password,
  cookieName: "eylul_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireUser() {
  const s = await getSession();
  return s.user ?? null;
}
