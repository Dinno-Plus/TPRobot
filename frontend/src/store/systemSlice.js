import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { services } from "../services";

const initialState = {
  promise: "none", //"none" | "pending" | "fulfilled" | "rejected",
  shutdown: false,
  restart: false,
  connectionLost: false,
  connectionLostWarned: false,
};

const set = createAsyncThunk("system/set", async (value, thunkAPI) => {
  try {
    await services.setSystem({ value });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    reset: () => initialState,
    change: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(set.fulfilled, (state) => {
        state.promise = "fulfilled";
      })
      .addCase(set.rejected, (state, action) => {
        state.promise = "rejected";
        console.log(action.payload);
      })
      .addCase(set.pending, (state) => {
        state.promise = "pending";
      });
  },
});

export const systemActions = {
  ...systemSlice.actions,
  set,
};
export const systemReducer = systemSlice.reducer;
