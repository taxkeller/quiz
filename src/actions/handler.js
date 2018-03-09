import * as dynamoDbLib from '../libs/dynamodb-lib';
import * as sesLib from '../libs/ses-lib';
import * as s3Lib from '../libs/s3-lib';
import { success, failure } from '../libs/response-lib';

export const quiz = (event, context, callback) => {
  return new Promise((resolve, reject) => { resolve(event); })
    .then(isValidMethod)
    .then(isValidRequest)
    .then(isValidApplicant)
    .then(getServerInfo)
    .then((body) => { success(body, callback); })
    .catch((error) => { failure(error, callback); })
  ;
};

const isValidMethod = (event) => {
  return new Promise((resolve, reject) => {
    if (event.httpMethod !== process.env.CORRECT_METHOD) {
      reject(`I cannot accept ${event.httpMethod} method. Please try with other methods.`);
    }

    resolve(event);
  })
};

const isValidRequest = (event) => {
  return new Promise((resolve, reject) => { resolve(event); })
    .then(hasBody)
    .then(hasJsonRequest)
    .then(hasRequiredParameters)
    .catch((e) => { throw new Error(e); })
  ;
};

const isValidApplicant = (data) => {
  return new Promise((resolve, reject) => { resolve(data); })
    .then(getApplicantByEmail)
    .then(isRegisteredApplicant)
    .then(isValidCode)
    .catch((e) => { throw new Error(e); })
  ;
}

const getServerInfo = () => {
  return new Promise((resolve, reject) => { resolve(); })
    .then(s3Lib.getPrivateKey)
    .then(resultGetServerInfo)
    .catch((e) => { throw new Error(e); })
  ;
}

const hasBody = (event) => {
  return new Promise((resolve, reject) => {
    if (!event.body) {
      return reject(`What's your name?`);
    }

    return resolve(event);
  });
};

const hasJsonRequest = (event) => {
  return new Promise((resolve, reject) => {
    let data = null;
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      return reject(`Please pass parameter with correct JSON format`);
    }

    data.isOffline = event.isOffline;
    data.ipAddress = event.requestContext.identity.sourceIp;
    return resolve(data);
  });
};

const hasRequiredParameters = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.name) {
      return reject(`What's your name?`);
    }

    if (!data.email) {
      return reject(`What's your email?`);
    }

    if (!data.code) {
      return createApplicant(data)
        .then(resultCreateApplicant)
        .then((e) => { reject(e); })
        .catch((e) => { reject(e); })
      ;
    }

    return resolve(data);
  })
};

const getApplicantByEmail = async (data) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      TableName: `${process.env.STAGE}-quiz_applicants`,
      Key: {
        email: data.email
      }
    };

    const applicant = await dynamoDbLib.call('get', params, data.isOffline);
    console.log(`Get account from DB: ${JSON.stringify(applicant)}`);
    return resolve({
      requestParameters: data,
      dbData: applicant
    });
  });
};

const isRegisteredApplicant = (data) => {
  return new Promise((resolve, reject) => {
    const { dbData, requestParameters } = data;

    if (!dbData.Item) {
      return createApplicant(requestParameters)
        .then(resultCreateApplicant)
        .then((e) => { reject(e); })
        .catch((e) => { reject(e); })
      ;
    }

    return resolve(data);
  });
};

const isValidCode = (data) => {
  return new Promise((resolve, reject) => {
    const { dbData, requestParameters } = data;

    if (requestParameters.code !== dbData.Item.code) {
      return reject(`Invalid verification code`);
    }

    return resolve();
  });
};

const createApplicant = async (data) => {
  return new Promise(async (resolve, reject) => {
    const code = ('000000' + Math.floor(Math.random() * 1000000)).slice(-6);
    const params = {
      TableName: `${process.env.STAGE}-quiz_applicants`,
      Item: {
        email: data.email,
        name: data.name,
        code: code,
        ipAddress: data.ipAddress,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      }
    };

    try {
      await dynamoDbLib.call('put', params, data.isOffline);
      return resolve(params.Item);
    } catch (e) {
      console.log(`Failed to create new applicant.`);
      return reject(`Failed to create new applicant.`);
    }
  });
}

const resultCreateApplicant = async (result) => {
  return new Promise((resolve, reject) => {
    sesLib.sendEmail(result.email, result.code)
      .catch((e) => { console.log(e); })
    ;
    return resolve('Your email has been registered. Please check your email and pass verification code as "code"');
  });
};

const resultGetServerInfo = (data) => {
  return new Promise((resolve, reject) => {
    const privateKey = data.Body.toString();
    const serverInfo = {
      message: 'Great. Please log in following server with these information.',
      server: process.env.SERVER_IP,
      user: process.env.USER,
      passphrase: process.env.PASSPHRASE,
      privateKey: privateKey
    };

    return resolve(serverInfo);
  });
};
