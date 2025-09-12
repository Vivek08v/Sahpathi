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
            console.log("roomSlice :", state.role);
        }
        // UNSET ROLE
    }
});

export const { setRole } = roomSlice.actions;
export default roomSlice.reducer;