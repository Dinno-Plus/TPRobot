import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { services } from "../services";

const initialState = {
  promise: "none", //"none", "pending", "fulfilled", "rejected",
  brightness: 1, // 0.5~1, step=0.005
  volume: 1, // 0~1, step=0.01
  voice: "baseFemale", // "baseFemale", "baseMale", "child", "user"
  alert: "alert1", // "alert1", "alert2", "alert3"
  music: "music1", // "music1", "music2", "music3"
  speed: 1.5, // 0.1~1.5, step=0.1
  light: "on", // "on", "off"
  avoid: "avoid1", // "avoid1", "avoid2", "avoid3"
  mappingPassword: "170824", // text
};

const get = createAsyncThunk("userSettings/get", async (_, thunkAPI) => {
  try {
    return await services.getUserSettings();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
const set = createAsyncThunk(
  "userSettings/set",
  async (newUserSettings, thunkAPI) => {
    try {
      const value = { ...newUserSettings };
      delete value.promise;
      await services.setUserSettings({ value });
      return newUserSettings;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    reset: () => initialState,
    change: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get.fulfilled, (_, action) => {
        return { ...action.payload, promise: "fulfilled" };
      })
      .addCase(get.rejected, (state, action) => {
        state.promise = "rejected";
        console.log(action.payload);
      })
      .addCase(get.pending, (state) => {
        state.promise = "pending";
      })
      .addCase(set.fulfilled, (_, action) => {
        return { ...action.payload, promise: "fulfilled" };
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

export const userSettingsActions = {
  ...userSettingsSlice.actions,
  get,
  set,
};
export const userSettingsReducer = userSettingsSlice.reducer;
