import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  LoginForm,
  LoginType,
  UserInformation,
} from "../types/login.type";
import axiosInstance from "../config/axios";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
// import { requestFirebaseToken } from "../firebase";

// Thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }: LoginForm, thunkAPI) => {
    try {
      const response = await axiosInstance.post<
        null,
        AxiosResponse<LoginType> | AxiosError
      >("/auth/login", {
        username,
        password,
      });
      if (isAxiosError(response)) {
        return thunkAPI.rejectWithValue(response.message);
      }
      await thunkAPI.dispatch(getInfoUser(response.data.access_token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

// get info about user
export const getInfoUser = createAsyncThunk(
  "auth/profile",
  async (token: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get
      <null,AxiosResponse<UserInformation> | AxiosError>
      ("/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
      if (isAxiosError(response)) {
        return thunkAPI.rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    username: "",
    role: "",
    accessToken: "",
    isAuthenticated: false,
    error: null as unknown,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.username = "";
      state.role = "";
      state.accessToken = "";
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload?.access_token || "";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.username = "";
        state.role = "";
        state.accessToken = "";
        state.isAuthenticated = false;
      })
      .addCase(getInfoUser.fulfilled, (state, action) => {
        state.username = action.payload.username;
        state.role = action.payload.role;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
