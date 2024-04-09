import { Prisma } from "src/generated/client";
import { ProfileAdapter } from "../adapters/database-adapters";

import { InternalServerProblem, InternalServerProblemCustom, NotFoundProblem } from "../entities/errors";
import enviroments from "../entities/enviroments";
import { S3Adapter } from "../adapters/aws-adapters";
import { SuccesfulCustom } from "../entities/responses";

export class ProfileService {
  private s3Adapter: S3Adapter;
  private profileAdatpter: ProfileAdapter;
  private config = {
    apiVersion: "2006-03-01",
    userBucket: enviroments.environment.AWS_USER_BUCKET
  };

  constructor(tx?: Prisma.TransactionClient) {
    this.profileAdatpter = new ProfileAdapter(tx);
    this.s3Adapter = new S3Adapter();
  }

  /**
   * get videos saved by user
   * @param userId //  *
   //  *
   */
  public async getProfiles(userId: string) {
    try {
      // const bucket = this.config.userBucket;
      const profiles = await this.profileAdatpter.getProfilesByUserId(userId);

      // for (const videos of result) {
      //   videos.videos.link_cover = await this.s3Adapter.signedUrlGet({
      //     Bucket: bucket,
      //     Key: videos.videos.link_cover,
      //     Expires: constants.timeOfExpires
      //   });
      //   videos.videos.link_video = await this.s3Adapter.signedUrlGet({
      //     Bucket: bucket,
      //     Key: videos.videos.link_video,
      //     Expires: constants.timeOfExpires
      //   });
      // }

      return profiles;
    } catch (error) {
      console.log(`Error in getProfiles: `, error);
      if (error?.statusCode) throw error;
      throw new InternalServerProblem(error);
    }
  }

  /**
   * Add new profile
   * @param {string} fullName profile's name
   * @param {string} userId userId
   */
  public async addNewProfile(fullName: string, userId: string) {
    try {
      const profiles = await this.profileAdatpter.getProfilesByUserId(userId);

      if(profiles.length >= 5) {
        throw new InternalServerProblemCustom(
          "Just 5 profiles is allowed!"
        );
      }

      await this.profileAdatpter.createProfile({
        profileName: fullName,
        user_id: userId
      });
      
      return new SuccesfulCustom("New profile added");
    } catch (error) {
      console.log(`Error in addNewProfile: `, error);
      if (error?.statusCode) throw error;
      throw new InternalServerProblem(error);
    }
  }
}
