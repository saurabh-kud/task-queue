const Redis = require("ioredis");
const config = require("config");
const taskProcessor = require("./taskProcessor");

const redis = new Redis(config.get("redis"));

const QUEUE_KEY = "task_queue";

const enqueue = async (user_id) => {
  await redis.rpush(
    QUEUE_KEY,
    JSON.stringify({ user_id, timestamp: Date.now() })
  );
};

const dequeue = async () => {
  const task = await redis.lpop(QUEUE_KEY);
  return task ? JSON.parse(task) : null;
};

const processQueue = async () => {
  const task = await dequeue();
  if (task) {
    await taskProcessor.process(task.user_id);
  }
  setTimeout(processQueue, 1000); // Process one task per second
};

processQueue();

module.exports = {
  enqueue,
};
