module.exports = {
  apps: [
    {
      name: "tms-app",
      script: "src/index.js",
      cron_restart: "0 0 * * *", // Every day at midnight
      env: { NODE_ENV: "production" },
    },
  ],
};
