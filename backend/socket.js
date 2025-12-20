import { Server } from "socket.io";
import userModel from "./models/userModel.js";
import captainModel from "./models/captainModel.js";

let io;

export const initializeSocket = (server) => {
  // Allow Vite dev frontend to connect over WebSocket
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("join", async ({ userId, userType }) => {
      console.log("➡️ JOIN EVENT RECEIVED:", { userId, userType, socketId: socket.id });

      try {
        if (!userId || !userType) {
          console.log("❌ JOIN FAILED: missing userId or userType");
          return;
        }

        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
          console.log("✅ USER SOCKET SAVED:", userId, socket.id);
        }

        if (userType === "captain") {
          await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
          console.log("✅ CAPTAIN SOCKET SAVED:", userId, socket.id);
        }
      } catch (err) {
        console.error("❌ JOIN ERROR:", err);
      }
    });

    socket.on("disconnect", async () => {
      console.log("🔴 Socket disconnected:", socket.id);

      const userResult = await userModel.updateMany(
        { socketId: socket.id },
        { $unset: { socketId: "" } }
      );

      const captainResult = await captainModel.updateMany(
        { socketId: socket.id },
        { $unset: { socketId: "" } }
      );

      console.log("🧹 SOCKET CLEANUP:", {
        socketId: socket.id,
        userUpdated: userResult.modifiedCount,
        captainUpdated: captainResult.modifiedCount,
      });
    });
  });
};

export const sendMessageToSocketId = (socketId, message) => {
  if (!io) {
    console.log("❌ EMIT FAILED: IO NOT INITIALIZED");
    return;
  }

  if (!socketId) {
    console.log("❌ EMIT FAILED: socketId missing", message.event);
    return;
  }

	const targetSocket = io.sockets.sockets.get(socketId);
	if (!targetSocket) {
		console.log("⚠️ EMIT SKIPPED: socket not connected", {
			socketId,
			event: message.event,
		});
		return;
	}

  console.log("📤 EMITTING EVENT:", {
    socketId,
    event: message.event,
  });

  targetSocket.emit(message.event, message.data);
};
