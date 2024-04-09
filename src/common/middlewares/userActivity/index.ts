import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import { UserActivityAdapter } from "src/common/adapters/database-adapters";
import {
  InternalServerProblem,
  UnauthorizedProblem,
} from "src/common/entities/errors";

export const userActivityMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEvent & { userId: any },
  APIGatewayProxyResult
> => {
  const after: middy.MiddlewareFn<
    APIGatewayProxyEvent & { userId: any },
    APIGatewayProxyResult
  > = async (request): Promise<any> => {
    try {
      const { userId } = request.event;

      if (!userId) {
        const error = new UnauthorizedProblem();
        request.response = {
          statusCode: error.statusCode,
          body: error.title,
        };
      }

      // const userActivityAdapter = new UserActivityAdapter();
      // const userActivity = await userActivityAdapter.getUserActivityByUserId(
      //   userId
      // );
      // if (!userActivity) throw new InternalServerProblem();

      // await userActivityAdapter.updateUserActivityById(userActivity.id);
    } catch (error) {
      console.log(`Error in after userActivityMiddleware: `, error);
      if (error?.statusCode) {
        request.response = {
          statusCode: error.statusCode,
          body: error.title,
        };
      } else {
        request.response = {
          statusCode: new InternalServerProblem().statusCode,
          body: new InternalServerProblem().title,
        };
      }
    }
  };

  return { after };
};
