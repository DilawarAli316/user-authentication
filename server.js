import path from "path";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import logger from "morgan";
import https from "https";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import fs from "fs";

const port = process.env.PORT || 2368;
const app = express();
dotenv.config();

connectDB();

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(notFound);
app.use(errorHandler);

const local = true;
let credentials = {};

if (local) {
  credentials = {
    key: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.key", "utf8"),
    cert: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.crt", "utf8"),
    ca: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.ca"),
  };
} else {
  credentials = {
    key: fs.readFileSync("../certs/ssl.key"),
    cert: fs.readFileSync("../certs/ssl.crt"),
    ca: fs.readFileSync("../certs/ca-bundle"),
  };
}

app.get("/", (req, res) => {
  res.send("Server is Running");
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server is running at the port ${port}`);
});
