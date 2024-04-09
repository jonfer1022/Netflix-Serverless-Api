import { Gender, Prisma } from "src/generated/client";
import {
  SeriesAdapter,
  MoviesAdapter
} from "../adapters/database-adapters";

import {
  InternalServerProblem
} from "../entities/errors";
import enviroments from "../entities/enviroments";
import { S3Adapter } from "../adapters/aws-adapters";
import { constants } from "../entities/contants";

export class HomeService {
  private s3Adapter: S3Adapter;
  private moviesAdatpter: MoviesAdapter;
  private seriesAdapter: SeriesAdapter;
  private config = {
    apiVersion: "2006-03-01",
    bucket: enviroments.environment.AWS_USER_BUCKET
  };

  constructor(tx?: Prisma.TransactionClient) {
    this.moviesAdatpter = new MoviesAdapter(tx);
    this.seriesAdapter = new SeriesAdapter(tx);
    this.s3Adapter = new S3Adapter();
  }

  /**
   * get main content
   */
  public async getMainContent() {
    try {
      const bucket = this.config.bucket;
      const genders = Object.keys(Gender);
      const series = {};
      for (const gender of genders) {
        series[`${gender}`] = await this.seriesAdapter.getSeriesByGender({
          has: gender as Gender
        });

        for (const serie of series[`${gender}`]) {
          serie.linkCover = await this.s3Adapter.signedUrlGet({
            Bucket: bucket,
            Key: serie.linkCover,
            Expires: constants.timeOfExpires
          });
        }
      }

      const take = 1;
      const randomNumber = Math.floor(Math.random() * 10);
      const movies = await this.moviesAdatpter.getMovies(
        null,
        { updated_at: "desc" },
        randomNumber,
        take
      );

      const movie = movies[0];
      movie.linkMovie = await this.s3Adapter.signedUrlGet({
        Bucket: bucket,
        Key: movie.linkMovie,
        Expires: constants.timeOfExpires
      });

      movie.linkTrailer = await this.s3Adapter.signedUrlGet({
        Bucket: bucket,
        Key: movie.linkTrailer,
        Expires: constants.timeOfExpires
      });

      return { ...series, movie };
    } catch (error) {
      console.log(`Error in getMainContent: `, error);
      if (error?.statusCode) throw error;
      throw new InternalServerProblem(error);
    }
  }
}
