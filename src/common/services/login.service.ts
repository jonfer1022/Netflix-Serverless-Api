import { Prisma, users } from "src/generated/client";
import { CognitoAdapter } from "../adapters/aws-adapters";
import { UserAdapter } from "../adapters/database-adapters";
import { InternalServerProblem, InternalServerProblemCustom, NotFoundProblem } from "../entities/errors";
import { SuccesfulDefault } from "../entities/responses";

export class LoginService {
  private userAdapter: UserAdapter;
  private cognitoAdapter: CognitoAdapter;

  constructor(tx?: Prisma.TransactionClient) {
    this.userAdapter = new UserAdapter(tx);
    this.cognitoAdapter = new CognitoAdapter();
  }

  /**
   * confirmSignUp
   * @param {string} phone users phone
   * @param {string} code users password
   */
  public async confirmSignUp(phone: string, code: string, password: string) {
    try {
      const user = await this.userAdapter.getUserByPhone(phone);
      if (!user) {
        throw new InternalServerProblemCustom(
          "User doesn't exist!"
        );
      }

      await this.cognitoAdapter.confirmSignUp(phone, code);

      await this.userAdapter.createUserProfile({
        profileName: user.fullName,
        user_id: user.id,
      })
      
      const result = await this.cognitoAdapter.signInUser(
        phone,
        password
      );
      const { AccessToken, RefreshToken } = result.AuthenticationResult;
      return { AccessToken, RefreshToken };
    } catch (error) {
      console.log(`Error in confirmSignUp: `, error);
      if (error?.statusCode) throw error;
      throw new InternalServerProblem();
    }
  }

  /**
   * signUp
   * @param {string} _user users interface
   */
  public async signUp(_user: Partial<users & { password: string}>) {
    try {
      const userExist = await this.userAdapter.getUserByPhone(_user.phone);
      if (userExist) throw new NotFoundProblem();

      const user = await this.userAdapter.createUser({
        ..._user,
        amountCodesSent: 1,
      });

      const attributes = [
        {
          Name: "email",
          Value: ""
        },
        {
          Name: "name",
          Value: user.fullName
        },
        {
          Name: "custom:userId",
          Value: user.id
        }
      ];

      await this.cognitoAdapter.signUpUser(
        user.phone,
        _user.password,
        attributes
      );

      return new SuccesfulDefault();
    } catch (error) {
      console.log(`Error in signUp: `, error);
      if (error?.statusCode) throw error;
      throw new InternalServerProblem();
    }
  }

  /**
   * signIn
   * @param {string} phone users phone
   * @param {string} password users password
   */
  public async signIn(phone: string, password: string) {
    try {
      const result = await this.cognitoAdapter.signInUser(phone, password);

      const user = await this.userAdapter.getUserByPhone(phone);
      if (!user) throw new NotFoundProblem();

      const { AccessToken, RefreshToken } = result.AuthenticationResult;
      return { AccessToken, RefreshToken };
    } catch (error) {
      console.log(`Error in signIn: `, error);
      if (error?.statusCode) throw error;
      throw new InternalServerProblem();
    }
  }

}
