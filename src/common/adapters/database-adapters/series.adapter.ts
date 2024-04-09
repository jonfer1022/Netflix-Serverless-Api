import { InternalServerProblem } from "src/common/entities/errors";
import {
  PrismaClient,
  Prisma,
  series
} from "../../../generated/client";

export class SeriesAdapter {
  private client: Prisma.TransactionClient | PrismaClient;

  constructor(tx?: Prisma.TransactionClient) {
    this.client = tx || new PrismaClient();
  }

  public async getSeriesByGender(
    gender: Prisma.EnumGenderNullableListFilter,
    skip = 0,
    take = 10
  ): Promise<series[]> {
    try {
      return await this.client.series.findMany({
        where: { gender },
        orderBy: { updated_at: "desc" },
        skip,
        take
      });
    } catch (error) {
      console.log(`Error in getSeriesByGender: `, error);
      throw new InternalServerProblem();
    }
  }
}
