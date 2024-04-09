import { handlerPath } from "../../src/libs/handler-resolver";
import { Gender, PrismaClient, series } from "../../src/generated/client";
const prisma = new PrismaClient();

// INSERT FAKE DATA!!
const insertSeries = async () => {
  const series: Array<Partial<series>> = [];
  const genders = Object.keys(Gender);
  for (let i = 0; i < 300; i++) {
    const randomNumber = Math.floor(Math.random() * 13);
    series.push({
      name: `Series-${i}`,
      productionCompany: "Netflix",
      linkTrailer: `series-1/cover.jpeg`,
      classification: "PG",
      gender: [genders[randomNumber] as Gender],
      linkCover: `series-1/cover.jpeg`,
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type`
    });
  }

  return Promise.all(
    series.map(
      async (serie) =>
        await prisma.series.create({
          data: {
            name: serie.name || "",
            classification: serie.classification || "M",
            productionCompany: serie.productionCompany || "",
            gender: serie.gender,
            linkTrailer: serie.linkTrailer,
            linkCover: serie.linkCover,
            description: serie.description
          }
        })
    )
  );
};

async function execute() {
  try {
    return await insertSeries();
  } catch (error) {
    console.log(`${handlerPath(__filename)}  ~ error: `, error);
    await prisma.$disconnect();
  }
}

export const main = {
  path: () => handlerPath(__filename),
  function: () => execute()
};
