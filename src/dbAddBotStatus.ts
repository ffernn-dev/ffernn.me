import { Database } from "bun:sqlite";
import { isbot } from "isbot";
const db = new Database("db/analytics.sqlite", { create: true });

// Iterate through rows and update
const rows = db.query("SELECT id, user_agent FROM requests").all();

for (const row of rows) {
  const newStatus = isbot(row.user_agent);
  db.query("UPDATE requests SET is_bot = ? WHERE id = ?").run(
    newStatus,
    row.id,
  );
}

console.log("Updated rows successfully!");
