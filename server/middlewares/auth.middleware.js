import jwt from "jsonwebtoken"

export const authN = async(req, res, next) => {
    try{
        const accessToken = req.cookies?.accessToken || req.body?.accessToken 
                            // req.header("Authorization")?.replace("Bearer ", "");

        if(!accessToken){
            return res.status(401).json({
                success: false,
                message: "access token not found"
            })
        }

        const payload = jwt.verify(accessToken, process.env.jwt_PASSWORD);
        req.user = payload;

        next();
    }
    catch(error){
        console.error("error in middleware authN: ", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired"
            });
        }

        return res.status(403).json({
            success: false,
            message: "Invalid token"
        });
    }
}