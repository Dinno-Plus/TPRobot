export { theme } from "./theme";

// timeouts
export const splashTimeout = 2 * 1000;
export const servingArrivedConfirmTimeout = 3 * 1000;
export const servingArrivedNoConfirmTimeout = 5 * 60 * 1000;
export const t2mMapModeChangeTimeout = 10 * 1000;
export const m2tMapModeChangeTimeout = 10 * 1000;
export const shutdownTimeout = 30 * 1000;
export const restartTimeout = 120 * 1000;
export const systemMessageConfirmedTimeout = 5 * 1000;

// intervals
export const getRobotInterval = 1 * 1000;
export const getLogInterval = 1 * 1000;
export const getMapsInterval = 0.2 * 1000;
export const blinkInterval = 1 * 1000;
export const lowBatteryBlinkInterval = 2 * 1000;

// threshold
export const lowBatteryThreshold = 20;
export const veryLowBatteryThreshold = 10;

// etc
export const secretRouteCodeLength = 6;
export const managerSecretRouteCode = [1, 1, 1, 0, 0, 0];
export const mappingSecretRouteCode = [0, 0, 0, 1, 1, 1];
export const minMappingPasswordLength = 6;

// service
export const serviceUrl = "/api/v1";

// audios
export const clickSound = "./sounds/clickSound.mp3";

// images
export const splashBgImg = "./images/splashBgImg_1920x1200.png";
export const layoutBgImg = "./images/layoutBgImg.jpg";
export const mainBgImg = "./images/mainBgImg.jpg";
export const progressBarBgImg = "./images/progressBarBgImg.png";

export const loadingImg = "./images/loadingImg.png";
export const emergencyImg = "./images/emergencyImg.png";
export const chargingImg = "./images/chargingImg.png";
export const goingImg = "./images/goingImg.png";
export const arrivedImg = "./images/arrivedImg.png";
export const confirmedImg = "./images/confirmedImg.png";
export const callingImg = "./images/callingImg.png";

export const headerLogoImg = "./images/headerLogoImg.png";

export const trayOnImg = "./images/trayOnImg.png";
export const trayOffImg = "./images/trayOffImg.png";

export const robotD0T2Img = "./images/robotD0T2Img.png";
export const robotD0T3Img = "./images/robotD0T3Img.png";
export const robotD0T5Img = "./images/robotD0T5Img.png";
export const robotD1T2Img = "./images/robotD1T2Img.png";
export const robotD1T3Img = "./images/robotD1T3Img.png";
export const robotD1T4Img = "./images/robotD1T4Img.png";
export const robotImgs = {
  robotD0T2: "./images/robotD0T2Img.png",
  robotD0T3: "./images/robotD0T3Img.png",
  robotD0T5: "./images/robotD0T5Img.png",
  robotD1T2: "./images/robotD1T2Img.png",
  robotD1T3: "./images/robotD1T3Img.png",
  robotD1T4: "./images/robotD1T4Img.png",
};
