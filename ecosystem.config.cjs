const path = require("path");
const os = require("os");

// NOTE: PM2_HOME must be set in the environment that runs `pm2 start` (e.g. PM2/systemd);
// this file does not load `.env`, so setting PM2_HOME only in `.env` will not affect this path.
const pm2LogDir = path.join(process.env.PM2_HOME || path.join(os.homedir(), ".pm2"), "logs");

module.exports = {
  apps: [
    {
      name: "tms-app",
      script: "src/index.js",
      cron_restart: "0 0 * * *", // Every day at midnight
      env: { NODE_ENV: "production" },
      // Restart if app crashes
      autorestart: true,
      max_restarts: 10,
      min_uptime: 60000, // Consider app unstable if it crashes in the first minute
      restart_delay: 5000, // Base delay between restarts for stable apps
      exp_backoff_restart_delay: 5000, // Exponential backoff for unstable crash loops
      // Logging
      out_file: path.join(pm2LogDir, "tms-app-out.log"),
      error_file: path.join(pm2LogDir, "tms-app-error.log"),
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
