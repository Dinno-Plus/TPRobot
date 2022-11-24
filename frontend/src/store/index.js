import { configureStore } from "@reduxjs/toolkit";
import { robotReducer } from "./robotSlice";
import { userSettingsReducer } from "./userSettingsSlice";
import { managerSettingsReducer } from "./managerSettingsSlice";
import { systemReducer } from "./systemSlice";
import { mapsReducer } from "./mapsSlice";

export const store = configureStore({
  reducer: {
    robot: robotReducer,
    userSettings: userSettingsReducer,
    managerSettings: managerSettingsReducer,
    system: systemReducer,
    maps: mapsReducer,
  },
});

export { robotActions } from "./robotSlice";
export { userSettingsActions } from "./userSettingsSlice";
export { managerSettingsActions } from "./managerSettingsSlice";
export { systemActions } from "./systemSlice";
export { mapsActions } from "./mapsSlice";
