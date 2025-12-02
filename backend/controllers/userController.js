import {validationResult} from "express-validator"
import userModel from "../models/userModel.js"
import {createUser} from "../services/userServices.js"

const registerUser = async(req, res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()})
        }

        const {fullname , email , password } = req.body ;
        const isUserAlreadyExists = await  userModel.findOne({email});

        if(isUserAlreadyExists){
            return res.status(400).json({
                message : "user already exists"
            })
        }

        const hashedPassword = await userModel.hashPassword(password);
        const user = await createUser({
            firstname : fullname.firstname ,
            lastname : fullname.lastname ,
            email , 
            password : hashedPassword 
        });

        const token = user.generateAuthToken();
        res.status(200).json({
            userData : user ,
            token : token 
        })
    }
    catch(e){
        console.error(e);
    }
}

export {registerUser}