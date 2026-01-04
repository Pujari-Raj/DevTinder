import {app, server} from "./app";
import { env } from "./config/config";

const startServer = async () => {
    // await connectToDB;
    server.listen(env?.PORT, () => {
        console.log(`🚀 Server running on port ${env?.PORT}`)
    })
}

startServer();