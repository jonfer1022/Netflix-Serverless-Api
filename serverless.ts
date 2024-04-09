import type { AWS } from "@serverless/typescript";
import functions from "functions";
import documentation from "documentation";
import * as dotenv from "dotenv";
dotenv.config();

const serverlessConfiguration: AWS = {
  service: "netflix-backend",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-openapi-documenter"
  ],
  provider: {
    name: "aws",
    versionFunctions: false,
    runtime: "nodejs14.x",
    region: "ap-southeast-2",
    timeout: 30,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000"
    }
  },
  functions,
  package: {
    patterns: [
      "!node_modules/prisma/libquery_engine-*",
      "!node_modules/@prisma/engines/**",
      "!src/generated/client/libquery_engine-*",
      "src/generated/client/schema.prisma",
      "src/generated/client/libquery_engine-rhel-*"
    ]
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10
    },
    "serverless-offline": {
      httpPort: process.env.PORT || 3000
    },
    documentation
  }
};

module.exports = serverlessConfiguration;
