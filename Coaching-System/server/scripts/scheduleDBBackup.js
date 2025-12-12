const cron = require("node-cron");

cron.schedule("0 3 * * *", () => {
  console.log("Running DB backup...");
  require("./backup-to-s3");
});
