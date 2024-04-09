import { CognitoJwtVerifier } from "aws-jwt-verify";
import * as AWS from "aws-sdk";
import {
  InitiateAuthResponse,
  Types
} from "aws-sdk/clients/cognitoidentityserviceprovider";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import { InternalServerProblem, Problem } from "src/common/entities/errors";
dotenv.config();

export class CognitoAdapter {
  private config = {
    apiVersion: "2016-04-18",
    region: process.env.AWS_REGION_FIRST
  };

  private secretHash = process.env.AWS_COGNITO_SECRET_CLIENT_ID;
  private clientId = process.env.AWS_COGNITO_CLIENT_ID;
  private poolId = process.env.AWS_USER_POOL_ID;

  private verifier = CognitoJwtVerifier.create({
    userPoolId: this.poolId,
    clientId: this.clientId,
    tokenUse: "access"
  });

  private cognitoIdentity: AWS.CognitoIdentityServiceProvider;

  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
  }

  public async signUpUser(
    username: string,
    password: string,
    userAttr?: Array<any>
  ) {
    try {
      const params = {
        ClientId: this.clientId,
        Username: username,
        Password: password,
        UserAttributes: userAttr,
        SecretHash: this.hashSecret(username)
      };
      await this.cognitoIdentity.signUp(params).promise();
      return true;
    } catch (error) {
      console.log(`Error in signUpUser: `, error);
      throw new InternalServerProblem();
    }
  }

  public async signInUser(
    username: string,
    password: string
  ): Promise<InitiateAuthResponse> {
    try {
      const params = {
        AuthFlow: "USER_PASSWORD_AUTH" /* required */,
        ClientId: this.clientId /* required */,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: this.hashSecret(username)
        }
      };
      return await this.cognitoIdentity.initiateAuth(params).promise();
    } catch (error) {
      console.log(`Error in signInUser: `, error);
      throw new InternalServerProblem();
    }
  }

  public async confirmSignUp(username: string, code: string) {
    try {
      const params = {
        ClientId: this.clientId,
        ConfirmationCode: code,
        Username: username,
        SecretHash: this.hashSecret(username)
      };
      await this.cognitoIdentity.confirmSignUp(params).promise();
    } catch (error) {
      console.log(`Error in cognito.adapter.confirmSignUp: `, error);
      throw new InternalServerProblem();
    }
  }

  public async forgotPassword(username: string) {
    try {
      const params = {
        ClientId: this.clientId /* required */,
        Username: username /* required */,
        SecretHash: this.hashSecret(username)
      };
      await this.cognitoIdentity.forgotPassword(params).promise();
    } catch (error) {
      console.log(`Error in cognito.adapter.forgotPassword: `, error);
      throw new InternalServerProblem();
    }
  }
  public async confirmNewPassword(
    username: string,
    code: string,
    password: string
  ): Promise<boolean> {
    try {
      const params = {
        ClientId: this.clientId /* required */,
        ConfirmationCode: code /* required */,
        Password: password /* required */,
        Username: username /* required */,
        SecretHash: this.hashSecret(username)
      };
      await this.cognitoIdentity.confirmForgotPassword(params).promise();
      return true;
    } catch (error) {
      console.log(`Error in cognito.adapter.confirmNewPassword: `, error);
      throw new InternalServerProblem();
    }
  }

  public async setPasswordToUser(
    username: string,
    newPassword: string
  ): Promise<boolean> {
    const params = {
      Password: newPassword /* required */,
      UserPoolId: this.poolId /* required */,
      Username: username /* required */,
      Permanent: true
    };

    try {
      await this.cognitoIdentity.adminSetUserPassword(params).promise();
      return true;
    } catch (error) {
      console.log(`Error in setPasswordToUser: `, error);
      throw new InternalServerProblem();
    }
  }

  /**
   * changePassword
   * @param {string} accessToken User's access token
   * @param {string} previousPassword User's old password
   * @param {string} proposedPassword User's new password
   */
  public async changePassword(
    accessToken: string,
    previousPassword: string,
    proposedPassword: string
  ): Promise<boolean> {
    try {
      const params = {
        AccessToken: accessToken,
        PreviousPassword: previousPassword,
        ProposedPassword: proposedPassword
      };
      await this.cognitoIdentity.changePassword(params).promise();
      return true;
    } catch (error) {
      console.log(`Error in changePassword: `, error);
      throw new InternalServerProblem();
    }
  }

  private hashSecret(username: string): string {
    return crypto
      .createHmac("SHA256", this.secretHash)
      .update(username + this.clientId)
      .digest("base64");
  }

  public async signOutGlobal(accessToken: string) {
    try {
      const params = { AccessToken: accessToken };
      await this.cognitoIdentity.globalSignOut(params).promise();
    } catch (error) {
      console.log(`Error in signOutGlobal: `, error);
      throw new InternalServerProblem();
    }
  }

  public async verifyAuth(token: string): Promise<any | Problem> {
    try {
      await this.verifier.verify(token);
      const params = { AccessToken: token };
      return await this.cognitoIdentity.getUser(params).promise();
    } catch (error) {
      console.log(`Error in verifyAuth: `, error);
      throw new InternalServerProblem();
    }
  }

  /**
   * get the usee phone number from the user attributes
   * @param {string} accessToken User's access token
   * @returns {string} phone number
   */
  public async getUserPhone(accessToken: string): Promise<string> {
    try {
      const params = { AccessToken: accessToken };
      const user = await this.cognitoIdentity.getUser(params).promise();
      const phone = user.UserAttributes.find(
        (attr) => attr.Name === "phone_number"
      );
      return phone.Value;
    } catch (error) {
      console.log(`Error in getUserPhone: `, error);
      throw new InternalServerProblem();
    }
  }

  /**
   * updateUserAttributes
   * @param {string} accessToken User's access token.
   * @param {Array} userAttr array with object of all attributes to change.
   */
  public async updateUserAttributes(
    accessToken: string,
    userAttr?: Array<Types.AttributeType>
  ) {
    try {
      const params = {
        AccessToken: accessToken,
        UserAttributes: userAttr
      };
      await this.cognitoIdentity.updateUserAttributes(params).promise();
    } catch (error) {
      console.log(`Error in updateUserAttributes: `, error);
      throw new InternalServerProblem();
    }
  }

  /**
   * verifyUserAttributes
   * @param {string} accessToken User's access token.
   * @param {string} attributeName Attribute to be changed.
   * @param {string} code Code to be verified.
   */
  public async verifyUserAttributes(
    accessToken: string,
    attributeName: string,
    code: string
  ) {
    try {
      const params = {
        AccessToken: accessToken,
        AttributeName: attributeName,
        Code: code
      };
      await this.cognitoIdentity.verifyUserAttribute(params).promise();
    } catch (error) {
      console.log(`Error in verifyUserAttributes: `, error);
      throw new InternalServerProblem();
    }
  }

  /**
   * reSendCode
   * @param {string} username users username or phone or email
   */
  public async reSendCode(username: string) {
    try {
      const params = {
        ClientId: this.clientId /* required */,
        Username: username,
        SecretHash: this.hashSecret(username)
      };
      await this.cognitoIdentity.resendConfirmationCode(params).promise();
    } catch (error) {
      console.log(`Error in reSendCode: `, error);
      throw new InternalServerProblem();
    }
  }

  /**
   * deleteUser
   * @param {string} accessToken User's access token
   */
  public async deleteUser(accessToken: string) {
    try {
      const params = { AccessToken: accessToken };
      return await this.cognitoIdentity.deleteUser(params).promise();
    } catch (error) {
      console.log(`Error in deleteUser: `, error);
      throw new InternalServerProblem();
    }
  }

  /**
   * refreshTokenCognito
   * @param {string} refreshToken User's refresh token
   */
  public async refreshTokenCognito(refreshToken: string, username: string) {
    try {
      const params = {
        AuthFlow: "REFRESH_TOKEN_AUTH" /* required */,
        ClientId: this.clientId /* required */,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: this.hashSecret(username)
        }
      };
      return await this.cognitoIdentity.initiateAuth(params).promise();
    } catch (error) {
      console.log(`Error in refreshTokenCognito: `, error);
      throw new InternalServerProblem();
    }
  }
}
