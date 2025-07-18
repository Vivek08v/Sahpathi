import express from 'express';
import cors from 'cors';
import {app, server} from './socket/socket';
// const app = express();

// middlewars
app.use(express.json())
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)

// routes
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