import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signUp = async(req, res) => {
    try{
        const {email, fullname, username, password} = req.body;
        if(!email || !fullname || !username || !password){
            return res.status(401).json({
                success: false,
                message: "missing input datas"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            fullname, 
            username,
            password: hashedPass,
        });

        if(!user){
            return res.status(400).json({
                success: false,
                message: "user couldnt added in db"
            })
        }

        user.password = undefined;
        return res.status(200).json({
            success: true,
            data: user,
            message: "user signedUp successfully"
        })
    }
    catch(error){
        console.error("User signUp failed", error)
        return res.status(500).json({
            success: false,
            message: "User signUp failed"
        })
    }
}

export const login = async(req, res) => {
    // console.log("reached")
    try{
        console.log(req.body)
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: "missing input datas"
            })
        }

        const user = await User.findOne({email});
        // const user = await User.findOne({ $or: [{username}, {email}]});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        const verifyPass = await bcrypt.compare(password, user.password);
        if(!verifyPass){
            return res.status(400).json({
                success: false,
                message: "password incorrect"
            })
        }

        const accessToken = jwt.sign(
            {id: user._id,username: user.username, email: user.email, role: user.role},
            process.env.jwt_PASSWORD,
            { expiresIn: "5m" }
        )
        const refreshToken = jwt.sign(
            {id: user._id, username: user.username, email: user.email, role: user.role},
            process.env.jwt_PASSWORD,
            { expiresIn: "7d" }
        )

        const options = {
            expires: new Date(Date.now() + 7*24*60*60*1000),
            httpOnly: true,
            sameSite: "lax",
            secure: false
        }

        user.refreshToken = refreshToken;
        await user.save();

        user.password = undefined;
        return res.cookie("accessToken", accessToken, options)
                  .cookie("refreshToken", refreshToken, options).status(200).json({
                    success: true,
                    data: user,
                    // accessToken: accessToken,
                    // refreshToken: refreshToken,
                    message: "user signedUp successfully"
        })
    }
    catch(error){
        console.error("User login failed", error)
        return res.status(500).json({
            success: false,
            message: "User login failed"
        })
    }
}


export const refreshAccessToken = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
                                        // ||  req.body.refreshToken;
        if(!refreshToken){
            return res.status(400).json({
                success: false,
                message: "no refresh token found"
            })
        }
        
        const user = await User.findOne({ refreshToken });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "refresh token do not match"
            })
        }

        const verifiedTokenPayload = jwt.verify(refreshToken, process.env.jwt_PASSWORD);
        const { exp, iat, ...rest } = verifiedTokenPayload;
        const newAccessToken = jwt.sign(
            rest, 
            process.env.jwt_PASSWORD,
            { expiresIn: "5m" }
        )
        
        const options = {
            expires: new Date(Date.now() + 7*24*60*60*1000),
            httpOnly: true,
            sameSite: "lax",
            secure: false
        }

        return res.cookie("accessToken", newAccessToken, options)
                  .cookie("refreshToken", refreshToken, options).status(200).json({
                    success: true,
                    // accessToken: newAccessToken,
                    // refreshToken: refreshToken,
                    message: "accessToken updated successfully"
        })
    }
    catch(error){
        console.error("Error in refreshing Access Token: ", error);
        return res.status(500).json({
            success: false,
            message: "Error in refreshing Access Token"
        })
    }
}

export const logout = async(req, res) => {
    try{
        const user = req.user;
        user.refreshToken = null;
        await user.save();
        return res.clearCookie("accessToken").clearCookie("refreshToken")
                .status(200).json({
                    success: true,
                    message: "Logout successful"
                });

    }
    catch(error){
        console.error("Error in logout: ", error);
        return res.status(500).json({
            success: false,
            message: "Error in logout"
        })
    }
}