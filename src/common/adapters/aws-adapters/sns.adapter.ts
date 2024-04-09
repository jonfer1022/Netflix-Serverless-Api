import * as AWS from "aws-sdk";
import * as env from "src/common/entities/enviroments";
import { PublishResponse } from "aws-sdk/clients/sns";
import { InternalServerProblem } from "src/common/entities/errors";

// Amazon Simple Notification Service (Amazon SNS)
export class SnsAdapter {
  private config = {
    apiVersion: "2010-03-31",
    region: env.default.environment.AWS_REGION_FIRST,
  };

  private snsProvider: AWS.SNS;

  constructor() {
    this.snsProvider = new AWS.SNS(this.config);
  }

  /**
   * sendOTP
   * @param {string} phone users phone
   * @param {string} code sms code
   */
  public async sendOTP(phone: string, code: string): Promise<PublishResponse> {
    try {
      const params = {
        Message: code /* required */,
        PhoneNumber: phone,
      };
      return await this.snsProvider.publish(params).promise();
    } catch (error) {
      console.log(`Error in sendOTP: `, error);
      throw new InternalServerProblem();
    }
  }
}