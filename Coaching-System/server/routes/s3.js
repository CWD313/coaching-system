const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

exports.uploadToS3 = (buffer, key, mimetype) => {
  return s3.upload({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
    ACL: 'public-read',
  }).promise();
};
