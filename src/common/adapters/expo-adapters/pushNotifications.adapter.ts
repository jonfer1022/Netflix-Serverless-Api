import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { InternalServerProblem } from "src/common/entities/errors";
// import env from "src/common/entities/enviroments";

export class NotificationExpoAdapter {
  private expo: Expo;
  // private config = {
  //   accessToken: env.environment.EXPO_ACCESS_TOKEN,
  // };

  constructor() {
    this.expo = new Expo();
    // optionally providing an access token if you have enabled push security
    // this.expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  }

  public async sendBatchNotifications(messages: ExpoPushMessage[]) {
    try {
      const chunks = this.expo.chunkPushNotifications(messages);
      return Promise.all(
        chunks.map(
          async (chunk) => {
            const sendPush = await this.expo.sendPushNotificationsAsync(chunk)
            console.log('-----> ~ NotificationExpoAdapter ~ sendPush:', sendPush)
            return sendPush
          }
        )
      );
    } catch (error) {
      console.log(`Error in sendBatchNotifications: `, error);
      throw new InternalServerProblem();
    }
  }
}
