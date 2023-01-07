import dotenv from "dotenv";

dotenv.config();

export enum Environment {
  Unknown = 0,
  Development,
  Production,
}

interface IConfig {
  environment: Environment;
  port: string | number;
  database: {
    mongodbUri: string;
    mongodbMain: string;
    mongodRoot: string;
    mongodPass: string;
  };
}

export const NODE_ENV: string = process.env.NODE_ENV || "development";

const development: IConfig = {
  environment: Environment.Development,
  port: process.env.PORT || 3000,
  database: {
    mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/",
    mongodbMain: process.env.MONGODB_DB_MAIN || "monorepo",
    mongodRoot: process.env.MONGODB_ROOT_USER || "monorepo",
    mongodPass: process.env.MONGODB_ROOT_PASS || "bsiSG8hyoP1xVMLRidyg",
  },
};

const production: IConfig = {
  environment: Environment.Production,
  port: process.env.PORT || 3000,
  database: {
    mongodbUri: process.env.MONGODB_URI || "mongodb://mongo:27017/",
    mongodbMain: process.env.MONGODB_DB_MAIN || "monorepo",
    mongodRoot: process.env.MONGODB_ROOT_USER || "monorepo",
    mongodPass: process.env.MONGODB_ROOT_PASS || "bsiSG8hyoP1xVMLRidyg",
  },
};

const configs: {
  [name: string]: IConfig;
} = {
  development,
  production,
};

export const config = configs[NODE_ENV];
