import * as dotenv from "dotenv";
dotenv.config();

export default {
  environment: {
    // AWS_REGION: process.env.AWS_REGION,
    DATABASE_URL: process.env.DATABASE_URL,
    AWS_REGION_FIRST: process.env.AWS_REGION_FIRST,
    AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
    AWS_COGNITO_SECRET_CLIENT_ID: process.env.AWS_COGNITO_SECRET_CLIENT_ID,
    AWS_USER_POOL_ID: process.env.AWS_USER_POOL_ID,
    AWS_USER_BUCKET: process.env.AWS_USER_BUCKET,
    AWS_USER_BUCKET_REGION: process.env.AWS_USER_BUCKET_REGION,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_ACCESS: process.env.SECRET_ACCESS,
    PROJECT_ID_FIREBASE: process.env.PROJECT_ID_FIREBASE,
    PRIVATE_KEY_FIREBASE: process.env.PRIVATE_KEY_FIREBASE.replace(
      /\\n/gm,
      "\n"
    ),
    CLIENT_EMAIL_FIREBASE: process.env.CLIENT_EMAIL_FIREBASE,
    AK_INVOKE_LAMBDA: process.env.AK_INVOKE_LAMBDA,
    SAK_INVOKE_LAMBDA: process.env.SAK_INVOKE_LAMBDA,
  },
} as const;
