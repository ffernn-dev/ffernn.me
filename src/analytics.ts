import { Database } from "bun:sqlite";
import Bowser from "bowser";
import net from "net";

const db = new Database("db/analytics.sqlite", { create: true });
db.query(
  `CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT,
  ip TEXT,
  referer TEXT,
  user_agent TEXT,
  browser_name TEXT,
  browser_version TEXT,
  os_name TEXT,
  os_version TEXT,
  platform_type TEXT,
  platform_vendor TEXT
);`,
).run();

export function logRequest(
  path: string,
  userAgent: string | null,
  referer: string | null,
  ip: string | undefined,
) {
  const parsedUA = userAgent ? Bowser.parse(userAgent) : null;
  const parsedIP = ip
    ? net.isIPv4(ip)
      ? ip
      : ip.replace(/^::ffff:/, "")
    : null;

  const result = db
    .query(
      `
  INSERT INTO requests (path, ip, referer, user_agent, browser_name, browser_version, os_name, os_version, platform_type, platform_vendor)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      path,
      parsedIP,
      referer || null,
      userAgent || null,
      parsedUA?.browser.name || null,
      parsedUA?.browser.version || null,
      parsedUA?.os.name || null,
      addStrings(parsedUA?.os.version, parsedUA?.os.versionName),
      parsedUA?.platform.type || null,
      parsedUA?.platform.vendor || null,
    );
}

export function getAnalyticsData() {
  const data = db.query("SELECT * FROM requests").all();
  console.log(data);
  return data;
}

const addStrings = (str1: string | undefined, str2: string | undefined) => {
  if (str1 === undefined || str2 === undefined) {
    return null;
  }
  return str1 + " " + str2;
};
