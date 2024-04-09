import { InternalServerProblem } from "src/common/entities/errors";
import {
  PrismaClient,
  Prisma,
  movies
} from "../../../generated/client";

export class MoviesAdapter {
  private client: Prisma.TransactionClient | PrismaClient;

  constructor(tx?: Prisma.TransactionClient) {
    this.client = tx || new PrismaClient();
  }

  public async getMovies(
    movies?: Partial<movies>,
    orderBy?: Prisma.Enumerable<Prisma.moviesOrderByWithRelationInput>,
    skip = 0,
    take = 10
  ): Promise<movies[]> {
    try {
      const whereMovies = null;
      if(movies) {
        whereMovies.where = movies ? { ...movies } : {};
        whereMovies.orderBY = orderBy ? { ...orderBy } : {}
      }
      return await this.client.movies.findMany({
        ...whereMovies,
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
