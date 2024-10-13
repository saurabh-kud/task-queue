const express = require("express");
const Redis = require("ioredis");
const config = require("config");
const taskController = require("./controllers/taskController");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();
const redis = new Redis(config.get("redis"));

app.use(express.json());

app.post("/task", rateLimiter, taskController.processTask);

module.exports = app;
