import AWS from 'aws-sdk';

export const call = (action, params, isOffline = false) => {
  AWS.config.update({ region: 'ap-southeast-1' });
  if (isOffline) {
    setLocalConf();
  }

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  return dynamoDb[action](params).promise();
};

const setLocalConf = () => {
  AWS.config.update({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
};
