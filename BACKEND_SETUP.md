## Backend Setup
### Navigate to the backend directory and install dependencies:

Bash

```
cd server
npm install
```
### Create a .env file in the backend folder:

Code snippet:
```
PORT=3000
MONGO_URI=mongodb+srv://your.mongo.uri.com
JWT_SECRET=your-jwt-secret
REDIS_URL=rediss://your.redis.url.example.com
```
## Start Backend Services:
### You need to run the API server and the Worker in two separate terminals.

Terminal 1 – API Server:

Bash
```
npm run start:server
```
Terminal 2 – Worker:

Bash
```
npm run start:worker
```