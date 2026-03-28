import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthState } from "./authType";

const initialState: AuthState = {
    users: JSON.parse(localStorage.getItem("users") || "[]"),
    currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
    tempEmail: localStorage.getItem("tempEmail") || undefined,
    tempPassword: localStorage.getItem("tempPassword") || undefined,
    tempOtp: localStorage.getItem("tempOtp") || undefined,   // ← NEW
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setTempEmail: (state, action: PayloadAction<string>) => {
            state.tempEmail = action.payload;
            localStorage.setItem("tempEmail", action.payload);
        },
        setTempPassword: (state, action: PayloadAction<string>) => {
            state.tempPassword = action.payload;
            localStorage.setItem("tempPassword", action.payload);
        },
        setTempOtp: (state, action: PayloadAction<string>) => {   // ← NEW
            state.tempOtp = action.payload;
            localStorage.setItem("tempOtp", action.payload);
        },

        registerUser: (state, action: PayloadAction<User>) => {
            const existingIndex = state.users.findIndex(
                u => u.email.toLowerCase() === action.payload.email.toLowerCase()
            );
            if (existingIndex >= 0) {
                state.users[existingIndex] = action.payload; // update if email exists
            } else {
                state.users.push(action.payload);
            }

            localStorage.setItem("users", JSON.stringify(state.users));
            state.currentUser = action.payload;
            localStorage.setItem("currentUser", JSON.stringify(action.payload));

            // clear temp data
            state.tempEmail = undefined;
            state.tempPassword = undefined;
            state.tempOtp = undefined;
            localStorage.removeItem("tempEmail");
            localStorage.removeItem("tempPassword");
            localStorage.removeItem("tempOtp");
        },

        loginUser: (state, action: PayloadAction<{ email: string}>) => {
            const user = state.users.find(
                u => u.email === action.payload.email
            );
            state.currentUser = user || null;
            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                // clear temp data
                state.tempEmail = undefined;
                state.tempPassword = undefined;
                state.tempOtp = undefined;
                localStorage.removeItem("tempEmail");
                localStorage.removeItem("tempPassword");
                localStorage.removeItem("tempOtp");
            }
        },

        logoutUser: (state) => {
            state.currentUser = null;
            localStorage.removeItem("currentUser");
        },
    },
});

export const {
    registerUser,
    loginUser,
    logoutUser,
    setTempEmail,
    setTempPassword,
    setTempOtp   // ← NEW
} = authSlice.actions;

export default authSlice.reducer;