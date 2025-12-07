import userModel from "../models/userModel.js";
import rideModel from "../models/rideModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto" ;
import { getDistanceAndTime } from "./mapService.js";

export const getFareService = async ({ pickup, destination, vehicleType }) => {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }

    const allowedVehicles = ["auto", "car", "bike"];
    if (!vehicleType || !allowedVehicles.includes(vehicleType)) {
        throw new Error("Invalid or missing vehicle type");
    }

    // base fare and per km for each vehicle
    const baseFare = {
        auto: 30,
        car: 50,
        bike: 20,
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        bike: 8,
    };

    // get distance from your map service
    const { distanceMeters } = await getDistanceAndTime(pickup, destination);
    const distanceKm = distanceMeters / 1000;

    const rawFare = baseFare[vehicleType] + perKmRate[vehicleType] * distanceKm;

    
    const fare = Math.round(rawFare * 100) / 100;

    return fare;
};

export const generateOtp = () => {
    // 6 digit numeric OTP between 100000 and 999999
    const min = 100000;
    const max = 999999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp.toString();
}

export const createRideService = async({user , pickup , destination , vehicleType})=>{
    const fare = await getFairServices(pickup , destination);

    const ride = rideModel.create({
        user  ,
        pickup , 
        destination ,
        vehicleType ,
        otp : generateOtp(),
        fare : fare[vehicleType]
    });
    return ride ;
}

export const confirmRideService = async({rideId , captain})=>{

}

export const startRideService = async({rideId , otp , captain})=>{

}

export const endRideService = async({rideId , captain})=>{

}