const { exec } = require('child_process');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({
  accessKeyId: process.env.AKIAVCT42T6ABTI26OFD,
  secretAccessKey: process.env.wdD2wu4bmKxNN3XbnQmvh/bYsIZiw70l5X2Toi1K,
  region: process.env.us-east-1,
});

const s3 = new AWS.S3();

const MONGO_URI = process.env.MONGO_URI;

async function backupToS3() {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const backupPath = `/tmp/mongo-backup-${timestamp}`;

  const dumpCommand = `mongodump --uri="${MONGO_URI}" --out=${backupPath}`;

  console.log("Running:", dumpCommand);

  exec(dumpCommand, async (err) => {
    if (err) {
      console.error("Mongo dump error:", err);
      return;
    }

    // ZIP backup folder
    const zipFile = `${backupPath}.zip`;
    exec(`zip -r ${zipFile} ${backupPath}`, async (zipErr) => {
      if (zipErr) return console.error("Zip error:", zipErr);

      const fileContent = fs.readFileSync(zipFile);

      // Upload to S3
      const key = `backups/db-backup-${timestamp}.zip`;

      await s3
        .upload({
          Bucket: process.env.AWS_BUCKET,
          Key: key,
          Body: fileContent,
        })
        .promise();

      console.log("Backup uploaded to S3:", key);

      fs.rmSync(backupPath, { recursive: true, force: true });
      fs.unlinkSync(zipFile);
    });
  });
}

module.exports = backupToS3;
