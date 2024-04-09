import { PrismaClient } from "../../src/generated/client";
import { ReasonsDefault } from "../../src/common/entities/enums";
import { handlerPath } from "../../src/libs/handler-resolver";

const prisma = new PrismaClient();

const insertReasonsToCloseAccount = async () => {
  const reasons = Object.entries(ReasonsDefault);
  return Promise.all(
    reasons.map(
      async (reason) =>
        await prisma.reasonsToCloseAccount.create({
          data: {
            id: reason[0],
            description: reason[1]
          }
        })
    )
  );
};

async function execute() {
  try {
    return await insertReasonsToCloseAccount();
  } catch (error) {
    console.log(`${handlerPath(__filename)}  ~ error: `, error);
    await prisma.$disconnect();
  }
}

export const main = {
  path: () => handlerPath(__filename),
  function: () => execute()
};
