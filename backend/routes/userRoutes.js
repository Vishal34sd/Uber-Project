import express from "express"
import {registerValidator} from "../validators/userValidator.js"
import {registerUser} from "../controllers/userController.js"



const router = express.Router();

router.post("/register" ,  registerValidator , registerUser );
// router.post("/login" , );
// router.get("/profile" , );
// router.get("/logout" , );


export default router ;