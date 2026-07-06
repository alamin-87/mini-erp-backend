import express from "express";
import cors from "cors";
import qs from "qs";
import { IndexRoute } from "./routes";
import { NotFound } from "./middlewares/NotFound";
import { globalErrorHandler } from "./middlewares/GlobalerrorHandler";

const app = express();

app.set("query parser", (str: string) => qs.parse(str));
app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use("/api", IndexRoute);

app.get("/", (_req, res) => {
  res.send("Mini ERP API");
});

app.use(NotFound);
app.use(globalErrorHandler);

export default app;
