import axios from "axios";

import { serviceUrl } from "../constants";

export const services = {
  // NOTE: get
  getRobot: async () => {
    const res = await axios.post(serviceUrl, { cmd: "getRobot" });
    return res.data;
  },
  getUserSettings: async () => {
    const res = await axios.post(serviceUrl, { cmd: "getUserSettings" });
    return res.data;
  },
  getManagerSettings: async () => {
    const res = await axios.post(serviceUrl, { cmd: "getManagerSettings" });
    return res.data;
  },
  getSystemLog: async () => {
    const res = await axios.post(serviceUrl, { cmd: "getSystemLog" });
    return res.data;
  },
  getDrivingLog: async () => {
    const res = await axios.post(serviceUrl, { cmd: "getDrivingLog" });
    return res.data;
  },
  getMaps: async () => {
    const res = await axios.post(serviceUrl, { cmd: "getMaps" });
    return res.data;
  },

  // NOTE: set
  setRobot: async (body) => {
    const res = await axios.post(serviceUrl, {
      cmd: "setRobot",
      ...body,
    });
    return res.data;
  },
  setUserSettings: async (body) => {
    const res = await axios.post(serviceUrl, {
      cmd: "setUserSettings",
      ...body,
    });
    return res.data;
  },
  setManagerSettings: async (body) => {
    const res = await axios.post(serviceUrl, {
      cmd: "setManagerSettings",
      ...body,
    });
    return res.data;
  },
  setMaps: async (body) => {
    const res = await axios.post(serviceUrl, {
      cmd: "setMaps",
      ...body,
    });
    return res.data;
  },
  setSystem: async (body) => {
    const res = await axios.post(serviceUrl, {
      cmd: "setSystem",
      ...body,
    });
    return res.data;
  },
};
