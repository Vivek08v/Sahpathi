import mongoose from "mongoose";
import 'dotenv/config'
import { config } from "dotenv";
config();

const {mongodb_URL} = process.env;

const connectDB = async() => {
    mongoose.connect(mongodb_URL)
    .then(()=> console.log("DB Connection Successful"))
    .catch((err)=> {
        console.log("DB Connection Failed");
        console.error(err);
        process.exit(1);
    })
}

export default connectDB;