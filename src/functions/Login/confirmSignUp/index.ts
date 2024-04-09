import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";
import env from "src/common/entities/enviroments";
import router from "src/common/router";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: router.login.confirmSignUp.name,
  events: [
    {
      http: {
        method: router.login.confirmSignUp.method,
        path: router.login.confirmSignUp.path,
        cors: { origin: router.login.confirmSignUp.origin },
        request: {
          schemas: {
            "application/json": {
              name: "ConfirmSignUpInputModel",
              schema,
            },
          },
        },
        documentation: {
          summary: "Confirm sign-up endpoint",
          description:
            "This endpoint is used to confirm the code sended to user.",
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
