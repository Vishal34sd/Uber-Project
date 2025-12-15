import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import io from "socket.io-client";
import {decodeAccessToken} from "../helper/Token.js"

const socket = io("http://localhost:8080");

export default function UserAvailableRide() {
  const [ride, setRide] = useState(null);
  const [status, setStatus] = useState("Waiting for captain");
  const userData = decodeAccessToken();
  const userId = userData._id; 

  useEffect(() => {

    socket.emit("join", {
      userId,
      userType: "user",
    });

    socket.on("ride-accepted", (rideData) => {
      setRide(rideData);
      setStatus("Captain accepted your ride");
    });

    socket.on("ride-rejected", (rideData) => {
      setRide(rideData);
      setStatus("Captain rejected your ride");
    });

    return () => {
      socket.off("ride-accepted");
      socket.off("ride-rejected");
    };
  }, []);

  const cancelRide = () => {
    socket.emit("user-cancel-ride", {
      rideId: ride._id,
    });

    setStatus("Ride cancelled by user");
    setRide(null);
  };

  const confirmRide = () => {
    socket.emit("user-confirm-ride", {
      rideId: ride._id,
    });

    setStatus("Ride confirmed");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {!ride ? (
          <div className="text-xl font-semibold text-gray-600">
            ⏳ Waiting for ride updates...
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Your Ride</h2>

            <p><b>Pickup:</b> {ride.pickup}</p>
            <p><b>Destination:</b> {ride.destination}</p>
            <p><b>Vehicle:</b> {ride.vehicleType}</p>

            <div className="mt-4 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold text-center">
              {status}
            </div>

            {status === "Captain accepted your ride" && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={confirmRide}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  Confirm
                </button>

                <button
                  onClick={cancelRide}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
