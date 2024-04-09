import * as seeds from "./";
import { PrismaClient } from "../../src/generated/client";
const prisma = new PrismaClient();

const main = async () => {
  try {
    const _seeds = Object.values(seeds);
    const executed = await prisma.seedsExecuted.findMany();
    const previouslyPathsExecuted: Array<string | null> = [];
    _seeds.forEach(async (seed) => {
      const _path = seed?.main?.path() || null;
      const pathExecuted = executed.map((exc) => exc.name);
      if (_path && !pathExecuted.includes(_path)) {
        await seed.main.function();
        console.log(`Seed executed: ${_path}`);
        await prisma.seedsExecuted.create({
          data: { name: _path }
        });
      } else {
        previouslyPathsExecuted.push(_path);
      }
    });
    console.log("Previously paths executed: ", previouslyPathsExecuted);
  } catch (error) {
    console.log("-----> ~ main ~ error:", error);
    await prisma.$disconnect();
    throw error;
  }
};

main();
