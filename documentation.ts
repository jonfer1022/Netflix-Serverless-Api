import * as dotenv from "dotenv";
import {
  _default,
  badRequest,
  loginScheme,
  succesful,
  getUserAccount
} from "src/common/entities/schemas";

import ConfirmPreSignUpInputModel from "@functions/Login/confirmSignUp/schema";
import SignInInputModel from "@functions/Login/signIn/schema";
import SignUpInputModel from "@functions/Login/signUp/schema";

dotenv.config();

const servers = [
  {
    url: "http://localhost:3000/dev",
    description: "Internal staging or development server for testing"
  }
];

if (process.env.NODE_ENV == "development")
  servers.push({
    url: process.env.SERVER_URL,
    description: "Development server for testing"
  });

export default {
  version: "0.0.1",
  title: "Netflix Serverless API",
  description: "Netflix Serverless OpenAPI endpoints",
  securitySchemes: {
    bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
  },
  tags: [
    { name: "Authentication" },
    { name: "Account Information" },
    { name: "Profile" },
    { name: "Manage Profiles" },
  ],
  servers,
  models: [
    {
      name: "ConfirmPreSignUpInputModel",
      description: "Confirm pre sign up input model",
      contentType: "application/json",
      schema: ConfirmPreSignUpInputModel
    },
    {
      name: "SignInInputModel",
      description: "Sign in input model",
      contentType: "application/json",
      schema: SignInInputModel
    },
    {
      name: "SignUpInputModel",
      description: "Sign up input model",
      contentType: "application/json",
      schema: SignUpInputModel
    },
    {
      name: "SuccessfulOperation",
      description: "Succesful model",
      contentType: "application/json",
      schema: succesful
    },
    {
      name: "BadRequest",
      description: "Bad request model",
      contentType: "application/json",
      schema: badRequest
    },
    {
      name: "DefaultErrorResponse",
      contentType: "application/json",
      schema: _default
    },
    {
      name: "LoginScheme",
      description: "Login output model",
      contentType: "application/json",
      schema: loginScheme
    },
    {
      name: "GetUserAccount",
      description: "Get user account output model",
      contentType: "application/json",
      schema: getUserAccount
    },
  ]
};
