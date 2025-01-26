import { env } from "./express/common/utils/envConfig";
import { app, logger } from "./server";

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  logger.info(`
🚀 iced-tea ready at: http://${HOST}:${PORT}
🔥 Redis Insight ready at: http://${HOST}:8001`);
});

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
