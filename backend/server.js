import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import { initializeSocket } from "./socket.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
