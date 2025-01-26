import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "./express/api-docs/openAPIRouter";
import { healthCheckRouter } from "./express/api/healthCheck/healthCheckRouter";
import errorHandler from "./express/common/middleware/errorHandler";
import requestLogger from "./express/common/middleware/requestLogger";
import { env } from "./express/common/utils/envConfig";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
