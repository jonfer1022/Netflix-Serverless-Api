import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";
import env from "src/common/entities/enviroments";
import router from "src/common/router";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: router.login.signUp.name,
  events: [
    {
      http: {
        method: router.login.signUp.method,
        path: router.login.signUp.path,
        cors: { origin: router.login.signUp.origin },
        request: {
          schemas: {
            "application/json": {
              name: "SignUpInputModel",
              schema,
            },
          },
        },
        documentation: {
          summary: "Sign-up endpoint",
          description: "This endpoint is used for user registration.",
          tags: ["Authentication"],
          methodResponses: [
            {
              statusCode: "200",
              responseBody: { description: "Successful operation" },
              responseModels: { "application/json": "LoginScheme" },
            },
            {
              statusCode: "400",
              responseBody: { description: "Bad Request" },
              responseModels: { "application/json": "BadRequest" },
            },
            {
              statusCode: "default",
              responseBody: { description: "Error message by default" },
              responseModels: { "application/json": "DefaultErrorResponse" },
            },
          ],
        },
      },
    },
  ],
  environment: { ...env.environment },
};
