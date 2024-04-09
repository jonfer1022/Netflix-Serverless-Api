import { InternalServerProblem } from "src/common/entities/errors";
import {
  PrismaClient,
  users,
  Prisma,
  profiles
} from "../../../generated/client";

export class ProfileAdapter {
  private client: Prisma.TransactionClient | PrismaClient;

  constructor(tx?: Prisma.TransactionClient) {
    this.client = tx || new PrismaClient();
  }

  public async getProfilesByUserId(userId: string): Promise<profiles[]> {
    try {
      return await this.client.profiles.findMany({
        where: { user_id: userId}
      });
    } catch (error) {
      console.log(`Error in getProfilesByUserId: `, error);
      throw new InternalServerProblem();
    }
  }

  public async createProfile(profile: Partial<profiles>): Promise<profiles> {
    try {
      return await this.client.profiles.create({
        data: {
          profileName: profile.profileName,
          linkIcon: profile.linkIcon,
          user_id: profile.user_id
        }
      });
    } catch (error) {
      console.log(`Error in createProfile: `, error);
      throw new InternalServerProblem();
    }
  }

  public async createUserProfile(profile: Partial<profiles>): Promise<profiles> {
    try {
      return await this.client.profiles.create({
        data: {
          profileName: profile.profileName,
          linkIcon: profile.linkIcon,
          user_id: profile.user_id
        }
      });
    } catch (error) {
      console.log(`Error in createUserProfile: `, error);
      throw new InternalServerProblem();
    }
  }

  public async updateUser(user: Partial<users>, id: string): Promise<users> {
    try {
      return await this.client.users.update({
        data: { ...user },
        where: { id }
      });
    } catch (error) {
      console.log(`Error in updateUser: `, error);
      throw new InternalServerProblem();
    }
  }

  public async getUserById(id: string): Promise<users> {
    try {
      return await this.client.users.findFirst({
        where: { id }
      });
    } catch (error) {
      console.log(`Error in getUserById: `, error);
      throw new InternalServerProblem();
    }
  }
}
