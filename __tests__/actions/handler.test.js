import AWS from 'aws-sdk-mock';
import { promisify } from 'util';
import { quiz } from '../../src/actions/handler';

const handler = promisify(quiz);

describe(`Lambda function test`, () => {
  beforeAll(() => {
    process.env.CORRECT_METHOD = 'PUT';
  });

  test(`1 + 1 = 2`, () => {
    expect(1 + 1).toBe(2);
  });

  test(`Get method.`, () => {
    const context = {};
    const event = { httpMethod: "GET" };

    handler(event, context)
      .then((data) => {
        const expectedBody = { message: `I cannot accept GET method. Please try with other methods.` };
        expect(data.statusCode).toBe(500);
        expect(data.body).toBe(JSON.stringify(expectedBody));
      })
      .catch((e) => { console.log(e); })
    ;
  });

  test(`Post method.`, () => {
    const context = {};
    const event = { httpMethod: "POST" };

    handler(event, context)
      .then((data) => {
        const expectedBody = { message: `I cannot accept POST method. Please try with other methods.` };
        expect(data.statusCode).toBe(500);
        expect(data.body).toBe(JSON.stringify(expectedBody));
      })
      .catch((e) => { console.log(e); })
    ;
  });

  test(`Delete method.`, () => {
    const context = {};
    const event = { httpMethod: "DELETE" };

    handler(event, context)
      .then((data) => {
        const expectedBody = { message: `I cannot accept DELETE method. Please try with other methods.` };
        expect(data.statusCode).toBe(500);
        expect(data.body).toBe(JSON.stringify(expectedBody));
      })
      .catch((e) => { console.log(e); })
    ;
  });

  test(`Put method without body.`, () => {
    const context = {};
    const event = { httpMethod: "PUT" };

    handler(event, context)
      .then((data) => {
        const expectedBody = { message: `What's your name?` };
        expect(data.statusCode).toBe(500);
        expect(data.body).toBe(JSON.stringify(expectedBody));
      })
      .catch((e) => { console.log(e); })
    ;
  });

  test(`Put method with body not formatted JSON.`, () => {
    const context = {};
    const event = {
      httpMethod: "PUT",
      body: "name='dummy'"
    };

    handler(event, context)
      .then((data) => {
        const expectedBody = { message: `Please pass parameter with correct JSON format` };
        expect(data.statusCode).toBe(500);
        expect(data.body).toBe(JSON.stringify(expectedBody));
      })
      .catch((e) => { console.log(e); })
    ;
  });

  test(`Put method with name formatted JSON.`, () => {
    const context = {};
    const event = {
      httpMethod: "PUT",
      isOffline: false,
      requestContext: {
        identity: {
          sourceIp: "127.0.0.1"
        }
      },
      body: '{"name": "dummy"}'
    };

    handler(event, context)
      .then((data) => {
        const expectedBody = { message: `What's your email?` };
        expect(data.statusCode).toBe(500);
        expect(data.body).toBe(JSON.stringify(expectedBody));
      })
      .catch((e) => { console.log(e); })
    ;
  });

  test(`Put method with name and email formatted JSON.`, () => {
    const context = {};
    const event = {
      httpMethod: "PUT",
      isOffline: false,
      requestContext: {
        identity: {
          sourceIp: "127.0.0.1"
        }
      },
      body: '{"name": "dummy", "email": "dummy@dummy.dummy"}'
    };

    handler(event, context)
      .then((data) => {
        const expectedBody = { message: `What's your email?` };
        expect(data.statusCode).toBe(500);
        expect(data.body).toBe(JSON.stringify(expectedBody));
      })
      .catch((e) => { console.log(e); })
    ;
  });
});
