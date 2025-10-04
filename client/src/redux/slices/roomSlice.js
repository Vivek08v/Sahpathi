import { createSlice } from "@reduxjs/toolkit";

// slice for current room

const initialState = {
    // room: null,
    joinedRooms: [],
    role: "Learner"
}

export const roomSlice = createSlice({
    name: "roomSlice",
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload;
        },
        // setRoom: (state, action) => {
        //     state.room = action.payload;
        // },
        setJoinedRoom: (state, action) => {
            state.room.joinedRooms.push(action.payload);
        }
        // UNSET ROLE
        // UNSET ROOM
        // Remove from joinedRooms
    }
});

export const { setRole, setJoinedRoom } = roomSlice.actions;
export default roomSlice.reducer;