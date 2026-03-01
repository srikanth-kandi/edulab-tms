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
      out_file: `${process.env.HOME || "/home/ubuntu"}/.pm2/logs/tms-app-out.log`,
      error_file: `${process.env.HOME || "/home/ubuntu"}/.pm2/logs/tms-app-error.log`,
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
