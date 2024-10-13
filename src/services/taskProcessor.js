const logger = require("../utils/logger");

const process = async (user_id) => {
  const timestamp = Date.now();
  console.log(`${user_id}-task completed at-${timestamp}`);
  logger.info(`${user_id}-task completed at-${timestamp}`);
};

module.exports = {
  process,
};
