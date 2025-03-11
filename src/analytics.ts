import { Database } from "bun:sqlite";
import Bowser from "bowser";

const db = new Database("db/analytics.sqlite", { create: true });

function logRequest(
  url: string,
  ip: string,
  referer: string,
  userAgent: string,
) {
  const parsedUA = Bowser.parse(userAgent);
  db.query(
    `
		INSERT INTO requests (url, ip, referer, user_agent)
		VALUES (?, ?, ?, ?)`,
  ).run(url, ip, referer, userAgent);
}
