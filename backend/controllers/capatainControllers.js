import captainModel from "../models/captainModel";
import { validationResult } from "express-validator";
import {createCaptain} from "../services/captainServices.js"

const registerCaptain = async(req, res)=>{
    try{
        const error = validationResult();
        if(!error.isEmpty()){
            return res.status(400).json({error : error.array()})
        }

        const {fullname , email , password , vehicle} = req.body ;

        const isCaptainExists = await captainModel.findOne({email});
        if(isCaptainExists){
            res.status(400).json({message : "Capataiun already exists "})
        }

        const hashedPassword = await captainModel.hashedPassword(password);

        const captain = await createCaptain({
            firstname : fullname.firstname,
            lastname : fullname.lastname ,
            email ,
            password : hashedPassword ,
            color : vehicle.color ,
            plate : vehicle.plate ,
            capacity : vehicle.capacity ,
            vehicleType : vehicle.vehicleType 
        });

        const token = captain.generateAuthToken();
        res.status(200).json({
            captainData : captain ,
            token : token 
        })
    }
    catch(e){
        console.log(e);
    }
}


const loginCaptain = async(req, res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()})
        }

        const {email , password } = req.body;

        const captain = await captainModel.findOne({email});

        if(!captain){
            return res.status(400).json({message : "Invalid credentials"});
        }

        const isMatch = await captain.comparePassword(password);

        if(!isMatch){
            return res.status(400).json({message : "Invalid credentials"});
        }

        const token = captain.generateAuthToken();
        res.cookie("token" , token);

        res.status(200).json({
            captainData : captain ,
            token : token 
        });

    }
    catch(e){
        console.log(e)
    }
}

const getCaptainProfile = async(req, res , )=>{
    return res.status(200).json({captain : req.captain})
}

const logoutCaptain = async(req , res)=>{
    res.clearCookies("token");
    res.status(200).json({message : "Logged out successfully"})
}

export {registerCaptain , loginCaptain , getCaptainProfile , logoutCaptain};