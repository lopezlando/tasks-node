# Welcome to tasks-node

## by Sebastian Lopez Lando

In order to start, open a command line in the root folder and run the following commands:

1\_`npm install` to install dependencies.

2\_`npm run env` to generate env variables for both development and testing environments. The development file will have MONGODB_URI and DB_NAME fields empty, since these must be completed with a valid mongoDB uri and db name. Without it, the server will create a local database. PLEASE NOTE that a secret key for JWT is automatically assigned from the example file. For security reasons, this should be modified.

2\_`npm run docs` to generate documentation for users and tasks APIs.

3\_`npm run test` to run jest unit testing for all endpoints.

4\_`npm run start:dev` to run the server with nodemon on. To skip nodemon, run `npm run start`.

5\_`npm run populate-db` to run a jest/supertest script that automatically populates the local db (mind you, this is not the testing db). If you're running this script on mac or linux, you might have to change the command's syntax inside package.json to this: `NODE_ENV=development npx jest ./populate-db.js`. After the command is successfully run, the command terminal will give you a user token that you can use for the tasks endpoints. PD: the script is made using jest and supertest. While maybe not ideal, it does the trick.

6_import the postman collection and environment. Copy the token generated in the `populate-db` script and paste it in the adminToken function in order to gain access to all endpoints.