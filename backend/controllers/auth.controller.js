import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { generateVerificationToken } from "../utils/generateVerificationToken.js";

export const signup = async(req, res) => {
    const { email, password, name } = req.body;
    try {
        if(!email || !password || !name){
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success:false, message:"User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = generateVerificationToken();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpires: Date.now() +24 * 60 * 1000
        })

        await user.save();

        generateTokenAndSetCookies(res,user._id);

        res.status(201).json({
            success:true,
            message:"User Created succesfully",
            user:{
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}

export const login = async(req, res) => {
    res.send('Login route');
}

export const logout = async(req, res) => {
    res.send('Logout route');
}