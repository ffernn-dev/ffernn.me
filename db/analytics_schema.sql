CREATE TABLE IF NOT EXISTS requests (
	id INTEGER PRIMARY KEY,
	path TEXT,
	ip TEXT,
	user_agent_id INTEGER NOT NULL REFERENCES user_agents(id),
	referer TEXT,
	session TEXT,
	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_agents (
	id INTEGER PRIMARY KEY,
	ua TEXT UNIQUE NOT NULL,
	is_bot INTEGER NOT NULL, -- Boolean
	browser_name TEXT,
	browser_version TEXT,
	os_name TEXT,
	os_version TEXT,
	platform_type TEXT,
	platform_vendor TEXT
);

CREATE VIEW non_bot_requests AS
SELECT *
FROM requests
WHERE user_agent_id IN (
	SELECT id FROM user_agents WHERE is_bot = 0
);
