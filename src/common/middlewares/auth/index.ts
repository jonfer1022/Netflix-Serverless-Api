import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CognitoAdapter } from "src/common/adapters/aws-adapters";
import {
  InternalServerProblem,
  UnauthorizedProblem
} from "src/common/entities/errors";

interface CustomAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  userId?: string;
  businessIds?: string[];
  token?: string;
}

export const authMiddleware = (): middy.MiddlewareObj<
  CustomAPIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<
    CustomAPIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request): Promise<any> => {
    try {
      const {
        event: { headers }
      } = request;
      const authorization = headers.Authorization || headers.authorization;
      const accessToken = authorization?.split("Bearer ")[1];

      if (!accessToken) {
        const error = new UnauthorizedProblem();
        request.response = {
          statusCode: error.statusCode,
          body: error.title
        };
      } else {
        const cognitoAdapter = new CognitoAdapter();
        const result = await cognitoAdapter.verifyAuth(accessToken);
        request.event.token = accessToken;

        result.UserAttributes.forEach(
          (element: { Name: string; Value: string }) => {
            if (element.Name === "sub") {
              request.event["username"] = element.Value;
            } else if (element.Name === "custom:userId") {
              request.event.userId = element.Value;
            } else {
              request.event[`${element.Name}`] = element.Value;
            }
          }
        );

        if (result?.statusCode && result?.title) {
          // Error
          request.response = {
            statusCode: result.statusCode,
            body: result.title
          };
        } else return;
      }
    } catch (error) {
      console.log(`Error in before authMiddleware: `, error);
      if (error?.statusCode) {
        request.response = {
          statusCode: error.statusCode,
          body: error.title
        };
      } else {
        request.response = {
          statusCode: new InternalServerProblem().statusCode,
          body: new InternalServerProblem().title
        };
      }
    }
  };

  return { before };
};
