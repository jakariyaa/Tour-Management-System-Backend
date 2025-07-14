import "dotenv/config";

interface EnvironmentVariables {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: string;
}

const loadEnvironmentVariables = (): EnvironmentVariables => {
  const requiredEnvVars = ["PORT", "MONGO_URI", "NODE_ENV"];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    MONGO_URI: process.env.MONGO_URI as string,
    NODE_ENV: process.env.NODE_ENV as string,
  };
};

export const env = loadEnvironmentVariables();
