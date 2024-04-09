import { handlerPath } from "@libs/handler-resolver";
import env from "src/common/entities/enviroments";
import router from "src/common/router";
const {
  Profile: { getProfiles }
} = router;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: getProfiles.name,
  events: [
    {
      http: {
        method: getProfiles.method,
        path: getProfiles.path,
        cors: { origin: getProfiles.origin },
        documentation: {
          summary: "Get Profiles endpoint",
          description: `This endpoint is used to get the profiles related with some user Id`,
          security: [{ bearerAuth: [] }],
          tags: ["Profiles"],
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
