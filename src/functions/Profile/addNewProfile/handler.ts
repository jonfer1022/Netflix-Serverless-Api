import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";

import schema from "./schema";
import { ProfileService } from "src/common/services";
import { BadRequestProblem } from "src/common/entities/errors";
import { PrismaClient } from "src/generated/client";
import { authMiddleware } from "src/common/middlewares/auth";

const prisma = new PrismaClient();
const addNewProfile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const { fullName } = event.body;
    const userId = String(event["userId"]);
    let result = null;
    await prisma.$transaction(async (tx) => {
      const profilesService = new ProfileService(tx);
      result = await profilesService.addNewProfile(
        fullName,
        userId,
      );
    });
    return formatJSONResponse({ ...result });
  } catch (error) {
    console.log(`Error in addNewProfile: `, error);
    if (error?.statusCode)
      return formatJSONResponse({ ...error }, error.statusCode);
    const err = new BadRequestProblem();
    return formatJSONResponse({ ...err }, err.statusCode);
  }
};

export const main = middyfy(addNewProfile).use(authMiddleware());
