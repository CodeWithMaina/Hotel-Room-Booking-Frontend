// Implement Persisting data slice

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthProps {
  email: string | null;
  token: string | null;
  userId: number | null;
  userType: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthProps = {
  email: null,
  token: null,
  userId: null,
  userType: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    persistCredentials: (
      state,
      action: PayloadAction<AuthProps>
    ) => {
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.userType = action.payload.userType;
        state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
        state.email = null;
        state.token = null;
        state.userId = null;
        state.userType = null;
        state.isAuthenticated = false;
    }
  },
});

export const {persistCredentials, clearCredentials} = authSlice.actions;
export default authSlice.reducer;

