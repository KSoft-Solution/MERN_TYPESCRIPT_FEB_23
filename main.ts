import { config } from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import debug from "debug";
import Colors = require("colors.ts");
import * as http from "http";
import * as winston from "winston";
import morgan from "morgan";
import * as expressWinston from "express-winston";
import { CommonRoutesConfig } from "./app/routes/routes.config";
import { UsersRoutes } from "./app/controller/user.controller";
import { PostRoutes } from "./app/controller/post.controller";
config({ path: "./example.env" });
Colors.enable(true);

const app: Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT ?? 9000;
const routes: Array<CommonRoutesConfig> = [];

const debugLog: debug.IDebugger = debug("app");
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
/** RULES OF OUR API */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}
app.use(expressWinston.logger(loggerOptions));
routes.push(new UsersRoutes(app));
routes.push(new PostRoutes(app));

// this is a simple route to make sure everything is working properly
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).json({
    message: "success",
    data: "hello world",
  });
});

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  console.log(`Server running at http://localhost:${port}`);
});
