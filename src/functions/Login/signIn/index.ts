import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";
import env from "src/common/entities/enviroments";
import router from "src/common/router";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: router.login.signIn.name,
  events: [
    {
      http: {
        method: router.login.signIn.method,
        path: router.login.signIn.path,
        cors: { origin: router.login.signIn.origin },
        request: {
          schemas: {
            "application/json": {
              name: "SignInInputModel",
              schema,
            },
          },
        },
        documentation: {
          summary: "Sign-in endpoint",
          description: "This endpoint is used for user authentication.",
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
