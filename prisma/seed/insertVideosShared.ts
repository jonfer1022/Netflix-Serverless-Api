import { handlerPath } from "../../src/libs/handler-resolver";
import {
  Platform,
  PrismaClient,
  videosShared
} from "../../src/generated/client";
const prisma = new PrismaClient();

// INSERT FAKE DATA!!
const insertVideosShared = async () => {
  const videosShared: Array<Partial<videosShared>> = [];
  const videos = await prisma.videos.findMany({ take: 10 });
  const users = await prisma.users.findMany({
    take: 10,
    orderBy: { updated_at: "asc" }
  });
  users.map(async (user) => {
    const amountVideosShared = Math.floor(Math.random() * (20 - 5) + 5);
    for (let i = 0; i < amountVideosShared; i++) {
      const randomVideo = Math.floor(Math.random() * (videos.length - 1) + 1);
      const keys = Object.keys(Platform);
      const randomPlatform = keys[Math.floor(Math.random() * 6)];
      let month = Math.floor(Math.random() * (6 - 1) + 1);
      let day = Math.floor(Math.random() * (28 - 1) + 1);
      const date = new Date(`2023-${month}-${day}`);
      videosShared.push({
        videos_id: videos[randomVideo].id,
        user_id: user.id,
        platform: Platform[randomPlatform],
        created_at: date,
        updated_at: date
      });
    }
  });

  const businessAccount = await prisma.businessAccount.findMany({
    take: 10,
    orderBy: { updated_at: "asc" }
  });

  businessAccount.map(async (business) => {
    const amountVideosShared = Math.floor(Math.random() * (20 - 5) + 5);
    for (let i = 0; i < amountVideosShared; i++) {
      const randomVideo = Math.floor(Math.random() * (videos.length - 1) + 1);
      const keys = Object.keys(Platform);
      const randomPlatform = keys[Math.floor(Math.random() * 6)];
      let month = Math.floor(Math.random() * (6 - 1) + 1);
      let day = Math.floor(Math.random() * (28 - 1) + 1);
      const date = new Date(`2023-${month}-${day}`);
      videosShared.push({
        videos_id: videos[randomVideo].id,
        business_account_id: business.id,
        platform: Platform[randomPlatform],
        created_at: date,
        updated_at: date
      });
    }
  });

  return Promise.all(
    videosShared.map(
      async (videoShared) =>
        await prisma.videosShared.create({
          data: {
            videos_id: videoShared.videos_id,
            user_id: videoShared.user_id || null,
            business_account_id: videoShared.business_account_id || null,
            platform: videoShared.platform,
            created_at: videoShared.created_at,
            updated_at: videoShared.updated_at
          }
        })
    )
  );
};

async function execute() {
  try {
    return await insertVideosShared();
  } catch (error) {
    console.log(`${handlerPath(__filename)}  ~ error: `, error);
    await prisma.$disconnect();
  }
}

export const main = {
  path: () => handlerPath(__filename),
  function: () => execute()
};
