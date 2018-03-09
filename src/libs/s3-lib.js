import AWS from 'aws-sdk';

export const getPrivateKey = () => {
  AWS.config.update({ region: 'ap-southeast-1' });
  const s3 = new AWS.S3({ endpoint: 's3-ap-southeast-1.amazonaws.com' });
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: process.env.S3_PRIVATE_KEY
  };

  return s3.getObject(params).promise()
};

