import {
  Gender,
  PrismaClient,
  StatusAccount,
  StatusVideos,
  businessAccount,
  users,
  videos,
} from "../../src/generated/client";
import { uniqueNamesGenerator, names } from "unique-names-generator";
import { handlerPath } from "../../src/libs/handler-resolver";

const prisma = new PrismaClient();

// INSERT FAKE DATA!!
const insertUsers = async (amountUsers: number) => {
  const users: Array<Partial<users>> = [];
  for (let i = 0; i < amountUsers; i++) {
    const userName: string = uniqueNamesGenerator({ dictionaries: [names] });
    const year = Math.floor(Math.random() * (99 - 50) + 50);
    const mounth = Math.floor(Math.random() * (12 - 1) + 1);
    const day = Math.floor(Math.random() * (30 - 2) + 2);
    const genders = Object.values(Gender);
    const gender = genders[Math.floor(Math.random() * 4)];
    const birthday = `19${year}-${mounth >= 10 ? mounth : `0${mounth}`}-${day}`;
    users.push({
      phone: `+61493508${Math.floor(Math.random() * (500 - 100) + 100)}`,
      fullName: `${userName}${i}`,
      birthday: new Date(birthday),
      status: StatusAccount.actived,
      gender: gender,
    });
  }

  return Promise.all(
    users.map(
      async (user) =>
        await prisma.users.create({
          data: {
            phone: user.phone || "",
            fullName: user.fullName || "",
            birthday: user.birthday || "",
            status: user.status,
            gender: user.gender,
          },
        })
    )
  );
};

const insertBusinessAccount = async (numBusinessByUser: number) => {
  const users = await prisma.users.findMany();
  const businessAccount: Array<Partial<businessAccount>> = [];
  users.map(async (user) => {
    for (let i = 0; i < numBusinessByUser; i++) {
      businessAccount.push({
        businessName: `${user.fullName}${i} LTD`,
        user_id: user.id,
        status: StatusAccount.actived,
      });
    }
  });
  return Promise.all(
    businessAccount.map(
      async (business) =>
        await prisma.businessAccount.create({
          data: {
            businessName: business.businessName || "",
            user_id: business.user_id || "",
            status: business.status,
          },
        })
    )
  );
};

const insertVideos = async (numVideosByBusiness: number = 2) => {
  const business = await prisma.businessAccount.findMany();
  const videos: Array<Partial<videos>> = [];
  business.map(async (_business) => {
    for (let i = 0; i < numVideosByBusiness; i++) {
      videos.push({
        link_video: `some-video${i}/${_business.id}/video.mp4`,
        business_account_id: _business.id,
        date_posting: new Date(),
        status: StatusVideos.public,
        description: `Some description from ${_business.businessName}${i}`,
      });
    }
  });

  return Promise.all(
    videos.map(
      async (video) =>
        await prisma.videos.create({
          data: {
            link_video: video.link_video || "",
            business_account_id: video.business_account_id || "",
            date_posting: video.date_posting || "",
            status: video.status,
            description: video.description,
          },
        })
    )
  );
};

async function execute() {
  try {
    await insertUsers(100);
    insertBusinessAccount(5);
    insertVideos(3);
  } catch (error) {
    console.log(`${handlerPath(__filename)}  ~ error: `, error);
    await prisma.$disconnect();
  }
}

export const main = {
  path: () => handlerPath(__filename),
  function: () => execute(),
};
