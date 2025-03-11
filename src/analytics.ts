import { Database } from "bun:sqlite";
import Bowser from "bowser";

const db = new Database("db/analytics.sqlite", { create: true });

export function logRequest(
  path: string,
  userAgent: string | null,
  referer: string | null,
  ip: string | undefined,
) {
  const parsedUA = userAgent ? Bowser.parse(userAgent) : null;
  console.log(parsedUA);
  console.log(referer);
  console.log(ip);
  // db.query(
  //   `
  // INSERT INTO requests (path, ip, referer, user_agent)
  // VALUES (?, ?, ?, ?)`,
  // ).run(path, ip || null, referer, userAgent);
}
