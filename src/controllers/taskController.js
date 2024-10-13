const taskQueue = require("../services/taskQueue");
const logger = require("../utils/logger");

const processTask = async (req, res) => {
  try {
    const { user_id } = req.body;
    await taskQueue.enqueue(user_id);
    res.status(202).json({ message: "Task queued successfully" });
  } catch (error) {
    logger.error("Error processing task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  processTask,
};
