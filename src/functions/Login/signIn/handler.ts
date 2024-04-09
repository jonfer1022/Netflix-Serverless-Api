import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";

import schema from "./schema";
import { LoginService } from "src/common/services";
import { BadRequestProblem } from "src/common/entities/errors";
import { PrismaClient } from "src/generated/client";

const prisma = new PrismaClient();
const signIn: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    let result = null;
    await prisma.$transaction(async (tx) => {
      const loginService = new LoginService(tx);
      result = await loginService.signIn(
        event.body.phone,
        event.body.password
      );
    });
    return formatJSONResponse({ ...result });
  } catch (error) {
    console.log(`Error in signIn: `, error);
    if (error?.statusCode)
      return formatJSONResponse({ ...error }, error.statusCode);
    const err = new BadRequestProblem();
    return formatJSONResponse({ ...err }, err.statusCode);
  }
};

export const main = middyfy(signIn);
