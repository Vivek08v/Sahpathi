import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        // required: true,
    },
    coverImg: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },
    lastLogin: { 
        type: Date
    },
    bio: { 
        type: String, 
        maxlength: 500 
    },
    skills: [String],
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    friendRequests: [
        {
            from: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User" 
            },
            status: {
                type: String, 
                enum: ["Pending", "Accepted", "Rejected"], 
                default: "Pending" 
            }
        },
    ],
    followers: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],
    following: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

userSchema.index({ username: 1, email: 1});
userSchema.index({ skills: 1 });

export const User = new mongoose.model("User", userSchema)