import { createSlice } from "@reduxjs/toolkit";

// slice for current room

const initialState = {
    room: null,
    role: "Learner"
}

export const roomSlice = createSlice({
    name: "roomSlice",
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setRoom: (state, action) => {
            state.room = action.payload;
        }
        // UNSET ROLE
        // UNSET ROOM
    }
});

export const { setRole, setRoom } = roomSlice.actions;
export default roomSlice.reducer;