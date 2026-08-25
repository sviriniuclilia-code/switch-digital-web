import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "sd_session";

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET nu este setat");
  return new TextEncoder().encode(s);
}

export async function createSession(payload: { sub: string; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { sub: string; email: string };
  } catch {
    return null;
  }
}
