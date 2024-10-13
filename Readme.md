<h2 align='center'>Rate Limiting and Task Queuing</h2>
<p align="center">
<a href="https://github.com/saurabh-kud"><img title="Author" src="https://img.shields.io/badge/Author-saurabh-kud--red.svg?style=for-the-badge&logo=github"></a>
</p>

<p align="center">
<a href="https://github.com/saurabh-kud"><img title="Followers" src="https://img.shields.io/github/followers/saurabh-kud?color=teal&style=flat-square"></a>
<a href="https://github.com/saurabh-kud/task-queue/network/members"><img title="Forks" src="https://img.shields.io/github/forks/saurabh-kud/task-queue?color=lightgrey&style=flat-square"></a>
<a href="https://github.com/saurabh-kud/task-queue/issues"><img title="issues" src="https://img.shields.io/github/issues/saurabh-kud/task-queue?style=flat-square">
</a>

</p>

<p align="center">
    Rate Limiting and Task Queuing- manage your tasks
</p>

# Node.js Task Queuing with Rate Limiting

This project implements a Node.js API cluster with task queuing and rate limiting capabilities. It processes user tasks with a rate limit of 1 task per second and 20 tasks per minute for each user ID.

## Features

- Node.js API cluster with multiple workers
- Redis-based task queuing system
- User-based rate limiting (1 task/second, 20 tasks/minute per user)
- Asynchronous task processing
- Logging of completed tasks

## Prerequisites

- Node.js
- Redis server
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/saurabh-kud/task-queue.git
   cd task-queue
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Configure Redis:
   - Ensure Redis is installed and running on your system.
   - Update the Redis configuration in `config/default.json` if necessary.

## Configuration

The main configuration file is `config/default.json`. You can adjust the following settings:

- `port`: The port on which the API server will run (default: 3000)
- `redis`: Redis connection details
  - `host`: Redis host (default: "localhost")
  - `port`: Redis port (default: 6379)

## Usage

1. Start the application:

   ```
   npm start
   ```

2. The API will be available at `http://localhost:3000` (or the port specified in your configuration).

3. To submit a task, send a POST request to `/task` with a JSON body:

   ```json
   {
     "user_id": "123"
   }
   ```

   Example using curl:

   ```
   curl -X POST -H "Content-Type: application/json" -d '{"user_id":"123"}' http://localhost:3000/task
   ```

4. The system will queue the task and process it according to the rate limits.

## Project Structure

```
project-root/
│
├── src/
│   ├── app.js                 # Express application setup
│   ├── cluster.js             # Cluster management
│   ├── controllers/
│   │   └── taskController.js  # Task processing controller
│   ├── middleware/
│   │   └── rateLimiter.js     # Rate limiting middleware
│   ├── services/
│   │   ├── taskQueue.js       # Task queuing service
│   │   └── taskProcessor.js   # Task processing service
│   └── utils/
│       └── logger.js          # Logging utility
│
├── config/
│   └── default.json           # Configuration file
│
├── logs/
│   └── tasks.log              # Task completion logs
│
├── package.json
└── README.md
```

## Logging

Completed tasks are logged in `logs/tasks.log`. Each log entry includes the user ID and timestamp of task completion.

## Error Handling

The application includes basic error handling:

- Rate limiting errors return a 429 status code with a "Too many requests" message.
- Internal server errors are logged and return a 500 status code.

## Scaling

The application uses Node.js clustering to take advantage of multi-core systems. It will create worker processes equal to the number of CPU cores available.

## Author

👤 **Saurabh kumar**

- Github: [@saurabh-kud](https://github.com/saurabh-kud)
- LinkedIN: [@saurabh-kud](https://www.linkedin.com/in/saurabh-kud/)

---

## License

&copy; Saurabh Kumar | MIT
