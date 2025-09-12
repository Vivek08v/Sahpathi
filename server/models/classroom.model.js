import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    classId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    classname: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    classtype: {
        type: String,
        enum: ["TUTOR", "GROUP_STUDY", "LIVE_ROOM"],
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum:["Searching", "Scheduled", "Ongoing", "Completed", "Cancelled"],
        default: "Searching",
    },
    schedule: {
        scheduledAt: {
            type: Date,
        },
        startedAt: {
            type: Date,
        },
        endedAt: {
            type: Date,
        }
    },
    participants: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ["Learner", "Tutor"],
                required: true
            }
        }
    ]
}, { timestamps: true });

classroomSchema.index({ category: 1, classtype: 1, status: 1 });

export const Classroom = new mongoose.model("Classroom", classroomSchema);