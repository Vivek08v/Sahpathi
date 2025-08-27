import express from 'express';
import cors from 'cors';
import {app, server} from './socket/socket.js';
import connectDB from './config/database.js';
import roomRoutes from "./routes/rooms.route.js"
// const app = express();

connectDB();

// middlewars
app.use(express.json())
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
)

// routes
app.use("/api/v1", roomRoutes);
app.get("/", (req, res)=>{
    res.json({
        success: true,
        message: "Your server is up and running..."
    })
})


// listening to server
server.listen(4000, ()=>{
    console.log("Server started at Port: 4000")
})