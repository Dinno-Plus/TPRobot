import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { services } from "../services";

const initialState = {
  promise: "none", //"none" | "pending" | "fulfilled" | "rejected",
  state: "loading", // "loadng", "ready", "going", "arrived", "emergency", "charging"
  mode: "none", // "none", "serving", "cruising", "calling"
  goal: { table: "", tray: [] }, // tray: [트레이 번호 위에서 부터 0, 1, ... ex) 0, 2 = 제일 위 트레이, 위에서 세번째 트레이]
  nextGoal: { table: "", tray: [] }, // 없는 경우: {table: "", tray: []},
  progress: 0, // 0~100
  battery: 100, // 0~100
  pause: false, // true: 일시정지, false: 일시정지 아님
  error: null, // { type: String, // "information", "warning", "error"     msg: String // "센서 1번이 블라블라"  } // null, undefined, 필드 없음 가능

  // internal states
  trays: new Array(3).fill({ selected: true, table: "" }),
  robotDirection: "front",
  goals: [],
};

const get = createAsyncThunk("robot/get", async (_, thunkAPI) => {
  try {
    return await services.getRobot();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
const set = createAsyncThunk("robot/set", async (value, thunkAPI) => {
  try {
    await services.setRobot({ value });
    return value;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const robotSlice = createSlice({
  name: "robot",
  initialState,
  reducers: {
    reset: () => initialState,
    change: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get.fulfilled, (state, action) => {
        return { ...state, ...action.payload, promise: "fulfilled" };
      })
      .addCase(get.rejected, (state, action) => {
        state.promise = "rejected";
        console.log(action.payload);
      })
      .addCase(get.pending, (state) => {
        state.promise = "pending";
      })
      .addCase(set.fulfilled, (state, action) => {
        return { ...state, ...action.payload, promise: "fulfilled" };
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

export const robotActions = {
  ...robotSlice.actions,
  get,
  set,
};
export const robotReducer = robotSlice.reducer;
