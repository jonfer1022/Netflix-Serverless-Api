# Stomble Backend Mobile

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM or Yarn to install the project dependencies

- Run `npm i` or `yarn` to install the project dependencies

### Locally

In order to test the project locally, run the following command:

- `npm run generate` the script generate the prisma dependencies necessary in the project to connection and queries to the DB
- `npm run off` this script run the project locally using the plugin "serverless-offline"

### Remotely

The first step is deploy the backend project into aws account. The properly way to happen
when the code is pushed into the repository backend. Currently the dev branch has the
action to deploy the code when it is updated.

The second step is take the url given where the endpoints are hosted and do the http request.

```
curl --location --request POST 'https://...amazonaws.com/dev/my-endpoint' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `common` - containing all the business logic, connections with externals services and other configurations.
- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file
- [serverless-openapi-documenter](https://www.serverless.com/plugins/serverless-openapi-documenter) - allowed create a document openApi (json) in order to document all the endpoints created in the backend project. In order to get the file updated make sure execute `npm run doc`.
