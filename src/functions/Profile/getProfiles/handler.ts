import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { ProfileService } from "src/common/services";
import { BadRequestProblem, Problem } from "src/common/entities/errors";
import { authMiddleware } from "../../../common/middlewares/auth";
import { PrismaClient } from "src/generated/client";

const prisma = new PrismaClient();

const getProfiles = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | Problem> => {
  try {
    const userId = String(event["userId"]);
    let result = null;
    await prisma.$transaction(async (tx) => {
      const profilesService = new ProfileService(tx);
      result = await profilesService.getProfiles(
        userId,
      );
    });
    return formatJSONResponse({ result });
  } catch (error) {
    console.log(`Error in getProfiles: `, error);
    if (error?.statusCode)
      return formatJSONResponse({ ...error }, error.statusCode);
    const err = new BadRequestProblem();
    return formatJSONResponse({ ...err }, err.statusCode);
  }
};

export const main = middyfy(getProfiles)
  .use(authMiddleware())
  // .use(userActivityMiddleware());
