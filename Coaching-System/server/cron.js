const cron = require('node-cron');
const notifyExpiring = require('./scripts/notifyexpiring');

// Runs every day at 10AM
cron.schedule('0 10 * * *', () => {
  console.log("Running expiry notification cron...");
  notifyExpiring();
});
const backupToS3 = require('./scripts/backup-to-s3');

// Daily at 2 AM
cron.schedule('0 2 * * *', () => {
  console.log("Running daily DB backup...");
  backupToS3();
});
