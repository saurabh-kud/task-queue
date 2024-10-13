const cluster = require("cluster");
const config = require("config");
const app = require("./app");

const NUM_WORKERS = 2; // Set the number of workers to 2
const basePort = config.get("port") || 3000;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork({ WORKER_PORT: basePort + i });
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Replace the dead worker
    cluster.fork({ WORKER_PORT: worker.process.env.WORKER_PORT });
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  const workerPort = process.env.WORKER_PORT;

  app
    .listen(workerPort, () => {
      console.log(`Worker ${process.pid} started on port ${workerPort}`);
    })
    .on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${workerPort} is already in use. Trying another port...`
        );
        setTimeout(() => {
          app.listen(0, () => {
            console.log(
              `Worker ${process.pid} started on random available port ${
                app.address().port
              }`
            );
          });
        }, 1000);
      } else {
        console.error("Error starting server:", error);
      }
    });
}
