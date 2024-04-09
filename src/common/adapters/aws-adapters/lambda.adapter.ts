import { Lambda } from "aws-sdk";
import env from "src/common/entities/enviroments";
import { InternalServerProblem } from "src/common/entities/errors";

export class LambdaAdapter {
  private lambda: Lambda;
  private config = {
    apiVersion: "2015-03-31",
    accessKeyId: env.environment.AK_INVOKE_LAMBDA,
    secretAccessKey: env.environment.SAK_INVOKE_LAMBDA,
    region: env.environment.AWS_USER_BUCKET_REGION,
  };

  constructor() {
    this.lambda = new Lambda(this.config);
  }

  public async invokeLambda(
    functionName: string,
    payload: any,
    invocationType?: string,
    logType?: string
  ) {
    try {
      return await this.lambda
        .invoke({
          InvocationType: invocationType || "Event",
          FunctionName: functionName,
          Payload: JSON.stringify(payload),
          LogType: logType,
        })
        .promise();
    } catch (error) {
      console.log(`Error in invokeLambda: `, error);
      throw new InternalServerProblem();
    }
  }
}
