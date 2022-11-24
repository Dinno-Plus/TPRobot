import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { services } from "../services";

const initialState = {
  promise: "none", //"none" | "pending" | "fulfilled" | "rejected",
  img: "", // Base64 인코딩한 현재 선택된 맵의 이미지
  mode: "Topologic", //  "Topologic", "Metric"
  maps: [
    { name: "지도 및 경로 A", selected: true, destinations: [] }, // true: 현재 선택됨, false: 선택 안됨
    { name: "지도 및 경로 B", selected: false, destinations: [] },
    { name: "지도 및 경로 C", selected: false, destinations: [] },
    { name: "지도 및 경로 D", selected: false, destinations: [] },
    { name: "지도 및 경로 E", selected: false, destinations: [] },
  ],
};

const get = createAsyncThunk("maps/get", async (_, thunkAPI) => {
  try {
    return await services.getMaps();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
const getMapImg = createAsyncThunk("maps/getMapImg", async (_, thunkAPI) => {
  try {
    return await services.getMaps();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
const set = createAsyncThunk("maps/set", async (body, thunkAPI) => {
  try {
    await services.setMaps(body);
    return body;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const mapsSlice = createSlice({
  name: "maps",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(get.fulfilled, (_, action) => {
        return { promise: "fulfilled", ...action.payload };
      })
      .addCase(get.rejected, (state, action) => {
        state.promise = "rejected";
        console.log(action.payload);
      })
      .addCase(getMapImg.pending, (state) => {
        state.promise = "pending";
      })
      .addCase(getMapImg.fulfilled, (state, action) => {
        state.promise = "fulfilled";
        state.img = action.payload.img;
      })
      .addCase(getMapImg.rejected, (state, action) => {
        state.promise = "rejected";
        console.log(action.payload);
      })
      .addCase(get.pending, (state) => {
        state.promise = "pending";
      })
      .addCase(set.fulfilled, (state, action) => {
        state.promise = "fulfilled";
        if (action.payload.value === "mode") {
          state.mode = action.payload.mode;
        } else if (action.payload.value === "load") {
          state.maps = state.maps.map(({ name, destinations }) => ({
            name,
            selected: name === action.payload.name,
            destinations,
          }));
        } else if (action.payload.value === "change") {
          state.maps = state.maps.map((m) =>
            m.selected ? { ...m, destinations: action.payload.destinations } : m
          );
        }
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

export const mapsActions = {
  ...mapsSlice.actions,
  get,
  getMapImg,
  set,
};
export const mapsReducer = mapsSlice.reducer;
