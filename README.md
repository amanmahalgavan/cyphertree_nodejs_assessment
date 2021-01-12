# Cyphertree Node.js Assessment
****
##### Prerequisites
###### **Please have these installed on your system before starting the nodejs server.**
1) Elasticsearch
2) Redis
3) Nodejs 
4) Postgres

##### Setup

  - Create .env file at the root of the project with the following environment variables:
    - NODE_ENV=development
    - DEV_SERVER_PORT= [Node Server Port Number]
    - DEV_AUTH_SECRET= [JWT Auth Secret]
    - DEV_DB_USER= [Postgres DB User]
    - DEV_DB_PASS= [Postgres DB Password]
    - DEV_DB= [Postgres DB Name]
    - DEV_DB_HOST= [Postgres DB Host. Example - 127.0.0.1 or localhost for local instance]
    - DEV_DIALECT=postgres
    - ELASTICSEARCH_URL= [Elasticsearch Instance URL. Example - http://127.0.0.1:9200]
    - REDIS_PORT= [Redis Instance Port Number]
    - REDIS_HOST= [Redis Instance Host. Example - 127.0.0.1 or localhost for local instance]

##### Installation
Install the dependencies and devDependencies and start the server.

```sh
$ cd cyphertree_nodejs_assessment
$ npm install
$ npm start
```

##### APIs List
  - ###### Auth Routes
    - /cyphertree/auth/signin
    - /cyphertree/auth/signup
  - ###### User Routes
    - /cyphertree/user/fetch
    - /cyphertree/user/update
    - /cyphertree/user/delete
    - /cyphertree/user/seed -- **Queues Background Jobs in Redis by reading a CSV file with users mock data (File already included in the repo.)**
    - /cyphertree/user/search -- **Executes an ElasticSearch search query.**

>**Use any REST Client for testing the APIs for example - Postman or Insomnia.**.

> **Background Jobs in Nodejs are implemented using Bull - https://optimalbits.github.io/bull/**

>**Authentication mechanism is implemented using Json Web Tokens - https://jwt.io/**