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
      restart_delay: 5000, // Wait 5s between restarts
      // Logging
      out_file: "/home/ubuntu/.pm2/logs/tms-app-out.log",
      error_file: "/home/ubuntu/.pm2/logs/tms-app-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
