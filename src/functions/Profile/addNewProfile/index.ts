import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";
import env from "src/common/entities/enviroments";
import router from "src/common/router";

const { Profile: { newProfile }} = router;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: newProfile.name,
  events: [
    {
      http: {
        method: newProfile.method,
        path: newProfile.path,
        cors: { origin: newProfile.origin },
        request: {
          schemas: {
            "application/json": {
              name: "AddNewProfileInputModel",
              schema,
            },
          },
        },
        documentation: {
          summary: "Add new profile endpoint",
          description:
            "This endpoint is used to add new profile.",
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
