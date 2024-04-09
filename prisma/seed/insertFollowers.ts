import { handlerPath } from "../../src/libs/handler-resolver";
import { PrismaClient, followers } from "../../src/generated/client";
const prisma = new PrismaClient();

// INSERT FAKE DATA!!
const insertFollowers = async () => {
  const followers: Array<Partial<followers>> = [];
  const usersNoBusiness = await prisma.users.findMany({
    where: { business_account: { none: {} } },
    include: { business_account: true },
  });
  const randomNumber = Math.floor(Math.random() * (20 - 5) + 5);
  const randombusiness = await prisma.businessAccount.findMany({
    skip: randomNumber,
    take: 1,
  });
  usersNoBusiness.map(async (user) => {
    followers.push({
      business_account_id: randombusiness[0].id,
      follow_user_account_id: user.id,
    });
  });

  const businessAccounts = await prisma.businessAccount.findMany({
    skip: randomNumber,
    take: 50,
  });

  businessAccounts.map(async (business) => {
    followers.push({
      business_account_id: randombusiness[0].id,
      follow_business_account_id: business.id,
    });
  });

  return Promise.all(
    followers.map(
      async (follower) =>
        await prisma.followers.create({
          data: {
            business_account_id: follower.business_account_id,
            follow_user_account_id: follower.follow_user_account_id || null,
            follow_business_account_id:
              follower.follow_business_account_id || null,
          },
        })
    )
  );
};

async function execute() {
  try {
    return await insertFollowers();
  } catch (error) {
    console.log(`${handlerPath(__filename)}  ~ error: `, error);
    await prisma.$disconnect();
  }
}

export const main = {
  path: () => handlerPath(__filename),
  function: () => execute(),
};
