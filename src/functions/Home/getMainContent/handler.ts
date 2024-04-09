import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";

import { HomeService } from "src/common/services";
import { BadRequestProblem, Problem } from "src/common/entities/errors";
import { authMiddleware } from "../../../common/middlewares/auth";
import { PrismaClient } from "src/generated/client";

const prisma = new PrismaClient();

const getMainContent = async (): Promise<APIGatewayProxyResult | Problem> => {
  try {
    let result = null;
    await prisma.$transaction(async (tx) => {
      const homeService = new HomeService(tx);
      result = await homeService.getMainContent();
    });
    return formatJSONResponse({ result });
  } catch (error) {
    console.log(`Error in getMainContent: `, error);
    if (error?.statusCode)
      return formatJSONResponse({ ...error }, error.statusCode);
    const err = new BadRequestProblem();
    return formatJSONResponse({ ...err }, err.statusCode);
  }
};

export const main = middyfy(getMainContent).use(authMiddleware());
