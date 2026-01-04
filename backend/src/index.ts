import { server } from "./app";
import { env } from "./config/config";
import { connectToDB } from "./config/database";

const startServer = async () => {
  try {
    await connectToDB();
    server.listen(env?.PORT, () => {
      console.log(`🚀 Server running on port ${env?.PORT}`);
    });    
  } catch (error) {
    console.error("Failed to connect to server",error)
    process.exit(1);
  }
};

startServer();