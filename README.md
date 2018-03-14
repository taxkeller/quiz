# quiz
=======

This is an application to check the user's basic curl skill.

## Prepare

- Make S3 bucket and upload key file
- Verify a email address which will be set as sender on this application
- Launch a EC2 server to check the user's basic Linux skill (if you need)

## Setup this application on local

- install serverless
```
$ npm install -g serverless
```

- install required packages
```
$ npm install
```

- install dynamodb on local
```
$ sls dynamodb install
```

- modify the environment variables of serverless.yml
```
  environment:
    CORRECT_METHOD: PUT
    USER_NAME: test_user
    PASSPHRASE: thisispassphrasefortesting
    SERVER_IP: 192.168.0.1
    S3_BUCKET: my-bucket
    S3_PRIVATE_KEY: key-name
    SES_FROM_EMAIL: example@email.dummy
```

- start serverless application
```
$ sls offline
```

- testing
```
$ curl http://localhost:4000
```

## Setup this application on Lambda Function

- deploy
```
$ sls deploy
```

- Modify the environment valiables on setting page of Lambda function

## Setup EC2 server (if you need)

- create user
```
$ sudo useradd test_user
$ sudo su - test_user
$ ssh-keygen -t rsa -b 4096     # upload it to S3
```

- create dummy directories
```
$ for i in `seq -f %02g 0 99`; do for j in `seq -f %02g 0 99`; do for k in `seq -f %02g 0 99`; do mkdir -p $i/$j/$k; done; done; done
```
