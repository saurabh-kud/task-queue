const Redis = require("ioredis");
const config = require("config");
const taskQueue = require("../services/taskQueue");

const redis = new Redis(config.get("redis"));

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_WINDOW_REQUEST_COUNT = 20;
const WINDOW_LOG_INTERVAL_IN_SECONDS = 1;

const rateLimiter = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const currentTime = Math.floor(Date.now() / 1000);
    const key = `ratelimit:${user_id}`;

    // Check if user_id exists in Redis
    const userExists = await redis.exists(key);

    if (!userExists) {
      // If user doesn't exist, add them and proceed
      await redis.zadd(key, currentTime, currentTime);
      return next();
    }

    const result = await redis
      .multi()
      .zremrangebyscore(key, "-inf", currentTime - WINDOW_SIZE_IN_SECONDS)
      .zadd(key, currentTime, currentTime)
      .zrange(key, 0, -1)
      .zcard(key)
      .exec();

    const requestsInWindow = result[3][1];

    if (requestsInWindow > MAX_WINDOW_REQUEST_COUNT) {
      // Queue the request to process later
      await taskQueue.enqueue(user_id);
      req.queuedForProcessing = true;
      return next();
    }

    // Check for 1 request per second
    const lastRequestTime = result[2][1][result[2][1].length - 2];
    if (
      lastRequestTime &&
      currentTime - lastRequestTime < WINDOW_LOG_INTERVAL_IN_SECONDS
    ) {
      // Queue the request to process later
      await taskQueue.enqueue(user_id);
      req.queuedForProcessing = true;
      return next();
    }

    next();
  } catch (error) {
    console.error("Rate limiting error:", error);
    next(error);
  }
};

module.exports = rateLimiter;
