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

    io.on("connection" , (socket)=>{
        socket.on("join" , async(data)=>{
            const {userId , userType} = data ;

            if(userType === "user"){
                await userModel.findByIdAndUpdate(userId , {socketId : socket.id});
            } else if (userType === "captain") {
                await captainModel.findByIdAndUpdate(userId , {socketId : socket.id});
            }
        });
        socket.on("update-location-captain" , async(data)=>{
            const {userId , location} = data ;
            await captainModel.findByIdAndUpdate(userId , {location : {
                ltd : location.ltd,
                lng : location.lng
            }});
        });
        socket.on("disconnect" , ()=>{
            console.log("user disconnected")
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (!io){
        console.log("socket not initialized");
        return;
    }

    if (!socketId){
        console.log("no socketId provided");
        return;
    }

    io.to(socketId).emit(messageObject.event , messageObject.data);
};

export { initializeSocket, sendMessageToSocketId };
