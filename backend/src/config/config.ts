import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value;
}

export const env = {
    NODE_ENV : process.env.NODE_ENV || "development",
    PORT : Number(process.env.PORT) || 8080,
    MONGODB_URL : required("MONGODB_URL"),
    DB_NAME : required("DB_NAME"),
}