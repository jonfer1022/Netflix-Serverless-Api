import * as Firebase from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import env from "src/common/entities/enviroments";
import { InternalServerProblem } from "src/common/entities/errors";

export class MessageFCMAdapter {
  private static instance: MessageFCMAdapter | null = null;
  private firebase: Firebase.app.App;
  private config = {
    clientEmail: env.environment.CLIENT_EMAIL_FIREBASE,
    privateKey: env.environment.PRIVATE_KEY_FIREBASE,
    projectId: env.environment.PROJECT_ID_FIREBASE,
  };

  private constructor() {
    this.firebase = Firebase.initializeApp({
      credential: Firebase.credential.cert({ ...this.config }),
    });
  }

  public static getInstance(): MessageFCMAdapter {
    if (!MessageFCMAdapter.instance) {
      MessageFCMAdapter.instance = new MessageFCMAdapter();
    }
    return MessageFCMAdapter.instance;
  }

  public async sendMsgToEachToken(message: Message[]) {
    try {
      return message.length
        ? await this.firebase.messaging().sendEach(message)
        : null;
    } catch (error) {
      console.log(`Error in sendMsgToEachToken: `, error);
      throw new InternalServerProblem();
    }
  }
}
