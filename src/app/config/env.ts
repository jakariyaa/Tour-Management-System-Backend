import "dotenv/config";

interface EnvironmentVariables {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: string;
  JWT_SECRET: string;
}

const loadEnvironmentVariables = (): EnvironmentVariables => {
  const requiredEnvVars = ["PORT", "MONGO_URI", "NODE_ENV", "JWT_SECRET"];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    MONGO_URI: process.env.MONGO_URI as string,
    NODE_ENV: process.env.NODE_ENV as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
  };
};

export const env = loadEnvironmentVariables();
