import { handlerPath } from "@libs/handler-resolver";
import env from "src/common/entities/enviroments";
import router from "src/common/router";
const {
  Home: { getMainContent }
} = router;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: getMainContent.name,
  events: [
    {
      http: {
        method: getMainContent.method,
        path: getMainContent.path,
        cors: { origin: getMainContent.origin },
        documentation: {
          summary: "Get Main content endpoint",
          description: `This endpoint is used to get main content showed in the main home page`,
          security: [{ bearerAuth: [] }],
          tags: ["Home"],
          methodResponses: [
            {
              statusCode: "200",
              responseBody: { description: "Successful operation" },
              responseModels: { "application/json": "LoginScheme" },
            },
            {
              statusCode: "400",
              responseBody: { description: "Bad Request" },
              responseModels: { "application/json": "BadRequest" }
            },
            {
              statusCode: "default",
              responseBody: { description: "Error message by default" },
              responseModels: { "application/json": "DefaultErrorResponse" }
            }
          ]
        }
      }
    }
  ],
  environment: { ...env.environment }
};
