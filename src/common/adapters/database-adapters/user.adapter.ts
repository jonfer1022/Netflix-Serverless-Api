import { InternalServerProblem } from "src/common/entities/errors";
import {
  PrismaClient,
  users,
  Prisma,
  profiles
} from "../../../generated/client";

export class UserAdapter {
  private client: Prisma.TransactionClient | PrismaClient;

  constructor(tx?: Prisma.TransactionClient) {
    this.client = tx || new PrismaClient();
  }

  public async getUserByPhone(phone: string): Promise<users> {
    try {
      return await this.client.users.findFirst({
        where: { phone }
      });
    } catch (error) {
      console.log(`Error in getUserByPhone: `, error);
      throw new InternalServerProblem();
    }
  }

  public async createUser(user: Partial<users>): Promise<users> {
    try {
      return await this.client.users.create({
        data: {
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          amountCodesSent: user.amountCodesSent
        }
      });
    } catch (error) {
      console.log(`Error in createUser: `, error);
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
