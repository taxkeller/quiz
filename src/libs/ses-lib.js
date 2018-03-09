import AWS from 'aws-sdk';

export const sendEmail = async (email, code) => {
  AWS.config.update({ region: 'eu-west-1' });
  const ses = new AWS.SES({ endpoint: 'email.eu-west-1.amazonaws.com' });

  const params = {
    Source: process.env.SES_FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Verification code" },
      Body: {
        Text: { Data: `Your verification code is ${code}` }
      }
    }
  };

  return await ses.sendEmail(params).promise();
}
