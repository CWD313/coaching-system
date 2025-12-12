const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

module.exports.uploadToS3 = (buffer, key, mimetype) => {
  const params = { Bucket: process.env.S3_BUCKET, Key: key, Body: buffer, ContentType: mimetype, ACL: 'public-read' };
  return s3.upload(params).promise();
};
