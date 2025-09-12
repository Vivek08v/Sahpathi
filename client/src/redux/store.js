import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { roomSlice } from "./slices/roomSlice";

const store = configureStore({
    reducer: {
        userSlice: userSlice.reducer,
        roomSlice: roomSlice.reducer,
    }
})

export default store;