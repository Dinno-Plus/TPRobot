import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { services } from "../services";

const initialState = {
  promise: "none", //"none" | "pending" | "fulfilled" | "rejected",
  numDrawers: 1, //0,1
  numTrays: 3, //2,3,4
  parm1: "", // String
  parm2: "", // String
  parm3: "", // String
  parm4: "", // String
  parm5: "", // String
  parm6: "", // String
};

const get = createAsyncThunk("managerSettings/get", async (_, thunkAPI) => {
  try {
    return await services.getManagerSettings();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
const set = createAsyncThunk(
  "managerSettings/set",
  async (newManagerSettings, thunkAPI) => {
    try {
      const value = { ...newManagerSettings };
      delete value.promise;
      await services.setManagerSettings({ value });
      return newManagerSettings;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const managerSettingsSlice = createSlice({
  name: "managerSettings",
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

export const managerSettingsActions = {
  ...managerSettingsSlice.actions,
  get,
  set,
};
export const managerSettingsReducer = managerSettingsSlice.reducer;
