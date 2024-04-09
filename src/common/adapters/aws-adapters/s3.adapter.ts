import { S3 } from "aws-sdk";
import env from "src/common/entities/enviroments";
import { InternalServerProblem } from "src/common/entities/errors";

export class S3Adapter {
  private s3: S3;
  private config = {
    apiVersion: "2006-03-01",
    accessKeyId: env.environment.ACCESS_KEY,
    secretAccessKey: env.environment.SECRET_ACCESS,
    region: env.environment.AWS_USER_BUCKET_REGION
  };

  constructor() {
    this.s3 = new S3(this.config);
  }

  public async updateFileToS3(params: S3.PutObjectAclRequest) {
    try {
      if (!params) throw new Error("Params cannot be null");
      await this.s3.putObject(params).promise();
    } catch (error) {
      console.log(`Error in uploadFileToS3: `, error);
      throw new InternalServerProblem();
    }
  }

  public async deleteFilesS3(params: S3.DeleteObjectsRequest) {
    try {
      if (!params) throw new Error("Params cannot be null");
      return await this.s3.deleteObjects(params).promise();
    } catch (error) {
      console.log(`Error in deleteFilesS3: `, error);
      throw new InternalServerProblem();
    }
  }

  public async signedUrlGet(params: {
    Bucket: string;
    Key: string;
    Expires: number;
  }) {
    try {
      if (!params) throw new Error("Params cannot be null");
      return await this.s3.getSignedUrlPromise("getObject", params);
    } catch (error) {
      console.log(`Error in signedUrlGet: `, error);
      throw new InternalServerProblem();
    }
  }
}
