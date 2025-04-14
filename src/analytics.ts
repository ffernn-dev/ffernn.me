import { Database } from "bun:sqlite";
import Bowser from "bowser";
import net from "net";
import { isbot } from "isbot";
import type { UUID } from "crypto";

const db = new Database("db/analytics.sqlite", { create: true });

type UserAgent = {
  id: number;
  ua: string;
  is_bot: boolean;
  browser_name: string | null;
  browser_version: string | null;
  os_name: string | null;
  os_version: string | null;
  platform_type: string | null;
  platform_vendor: string | null;
};

export function logRequest(
  path: string,
  userAgent: string | null,
  referer: string | null,
  ip: string | null,
  sessionCookie: UUID,
) {
  // Look for existing User Agent in db
  const uaQuery = db.query("SELECT * FROM user_agents WHERE ua = ?");
  const uaRow = uaQuery.get(userAgent) as UserAgent | undefined;
  let uaID: number;

  if (!uaRow) {
    // Parse the user agent
    const parsedUA = userAgent ? Bowser.parse(userAgent) : null;

    const result = db
      .prepare(
        `
		INSERT INTO user_agents (ua, is_bot, browser_name, browser_version, os_name, os_version, platform_type, platform_vendor)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`,
      )
      .run(
        userAgent,
        isbot(userAgent),
        parsedUA?.browser.name || null,
        parsedUA?.browser.version || null,
        parsedUA?.os.name || null,
        concatStrings(parsedUA?.os.version, parsedUA?.os.versionName),
        parsedUA?.platform.type || null,
        parsedUA?.platform.vendor || null,
      );

    uaID = Number(result.lastInsertRowid);
  } else {
    uaID = uaRow.id;
  }

  // Strip the referer string
  var refererMatches =
    referer && referer.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  referer = refererMatches && refererMatches[1];

  db.query(
    `
  INSERT INTO requests (path, ip, user_agent_id, referer, session)
  VALUES (?, ?, ?, ?, ?)`,
  ).run(path, ip, uaID, referer || null, sessionCookie);
}

export function getAnalyticsData(excludeBots: boolean) {
  console.log(excludeBots);
  const tableName = excludeBots ? "non_bot_requests" : "requests";
  const data = {
    views: db.query(`SELECT COUNT(*) AS n FROM ${tableName};`).get().n,
    visits: db
      .query(`SELECT COUNT(DISTINCT session) AS n FROM ${tableName};`)
      .get().n,
    pages: db
      .query(`SELECT path, COUNT(path) AS n FROM ${tableName} GROUP BY path;`)
      .all(),
    referrers: db
      .query(
        `SELECT referer, COUNT(referer) AS n FROM ${tableName} GROUP BY referer`,
      )
      .all(),
    browsers: db
      .query(
        `SELECT ua.browser_name, COUNT(ua.browser_name) AS n FROM ${tableName} r JOIN user_agents ua ON r.user_agent_id = ua.id GROUP BY ua.browser_name`,
      )
      .all(),
    operating_systems: db
      .query(
        `SELECT ua.os_name, COUNT(ua.os_name) AS n FROM ${tableName} r JOIN user_agents ua ON r.user_agent_id = ua.id GROUP BY ua.os_name`,
      )
      .all(),
    devices: db
      .query(
        `SELECT ua.platform_type, COUNT(ua.platform_type) AS n FROM ${tableName} r JOIN user_agents ua ON r.user_agent_id = ua.id GROUP BY ua.platform_type`,
      )
      .all(),
  };
  console.log(data);
  return data;
}

// String concatenation that can survive undefined inputs
const concatStrings = (str1: string | undefined, str2: string | undefined) => {
  if (str1 === undefined || str2 === undefined) {
    return null;
  }
  return str1 + " " + str2;
};
