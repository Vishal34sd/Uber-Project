import { Server } from "socket.io";
import userModel from "./models/userModel.js";
import captainModel from "./models/captainModel.js";

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", async ({ userId, userType }) => {
      try {
        if (!userId || !userType) return;

        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        }

        if (userType === "captain") {
          await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("update-location-captain", async ({ userId, location }) => {
      try {
        if (!userId || !location) return;

        await captainModel.findByIdAndUpdate(userId, {
          location: {
            lat: location.lat,
            lng: location.lng,
          },
        });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        await userModel.updateMany(
          { socketId: socket.id },
          { $unset: { socketId: "" } }
        );

        await captainModel.updateMany(
          { socketId: socket.id },
          { $unset: { socketId: "" } }
        );
      } catch (error) {
        console.error(error);
      }
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  if (!io || !socketId) return;
  io.to(socketId).emit(messageObject.event, messageObject.data);
};

export { initializeSocket, sendMessageToSocketId };
