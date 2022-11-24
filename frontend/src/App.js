import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoutes, Navigate, useLocation } from "react-router-dom";

import {
  robotActions,
  userSettingsActions,
  managerSettingsActions,
  systemActions,
} from "./store";
import { Layout } from "./layouts";
import {
  Splash,
  Serving,
  Cruising,
  Calling,
  Mapping,
  UserSettings,
  ManagerSettings,
  Shutdown,
  Restart,
} from "./views";
import { useInterval } from "./hooks";
import { getRobotInterval } from "./constants";

let isFirstRender = true;
export const App = () => {
  const { promise: robotPromise, mode } = useSelector((state) => state.robot);
  const userSettingsPromise = useSelector(
    (state) => state.userSettings.promise
  );
  const { promise: managerSettingsPromise, numTrays } = useSelector(
    (state) => state.managerSettings
  );
  const { connectionLost } = useSelector((state) => state.system);
  const dispatch = useDispatch();
  const location = useLocation();

  useInterval(() => {
    dispatch(robotActions.get());
    if (userSettingsPromise === "rejected") {
      dispatch(userSettingsActions.get());
    }
    if (managerSettingsPromise === "rejected") {
      dispatch(managerSettingsActions.get());
    }
  }, getRobotInterval);

  useEffect(() => {
    const transitionStartTimeout = setTimeout(() => {
      dispatch(
        robotActions.change({
          name: "robotDirection",
          value:
            location.pathname === "/serving" &&
            (mode === "serving" || mode === "none")
              ? "left"
              : "front",
        })
      );
    }, 1);

    return () => clearTimeout(transitionStartTimeout);
  }, [dispatch, location, mode]);

  useEffect(() => {
    // get Settings
    if (isFirstRender) {
      isFirstRender = false;
      dispatch(userSettingsActions.get());
      dispatch(managerSettingsActions.get());
    }
    // check connectionLost
    if (!connectionLost && robotPromise === "rejected") {
      dispatch(systemActions.change({ name: "connectionLost", value: true }));
      dispatch(
        robotActions.change({
          name: "error",
          value: {
            type: "error",
            msg: "현재 로봇과의 연결이 원활하지 않습니다.\n로봇의 전원 또는 연결 상태를 확인해 주세요.",
          },
        })
      );
    } else if (connectionLost && robotPromise === "fulfilled") {
      dispatch(systemActions.change({ name: "connectionLost", value: false }));
      dispatch(robotActions.change({ name: "error", value: null }));
    }
  }, [dispatch, robotPromise, connectionLost]);

  useEffect(() => {
    // init
    dispatch(
      robotActions.change({
        name: "trays",
        value: new Array(numTrays)
          .fill({ selected: false, table: "" })
          .map((t, i) => (i === 0 ? { selected: true, table: "" } : t)),
      })
    );
  }, [dispatch, numTrays]);

  useEffect(() => {
    // reset
    return () => {
      dispatch(robotActions.reset());
      dispatch(userSettingsActions.reset());
      dispatch(managerSettingsActions.reset());
      dispatch(systemActions.reset());
    };
  }, [dispatch]);

  return (
    <>
      {useRoutes([
        { path: "/", element: <Splash /> },
        { path: "/shutdown", element: <Shutdown /> },
        { path: "/restart", element: <Restart /> },
        {
          element: <Layout />,
          children: [
            { path: "/serving", element: <Serving /> },
            { path: "/cruising", element: <Cruising /> },
            { path: "/calling", element: <Calling /> },
            { path: "/mapping", element: <Mapping /> },
            { path: "/userSettings", element: <UserSettings /> },
            { path: "/managerSettings", element: <ManagerSettings /> },
          ],
        },
        { path: "/*", element: <Navigate to="/serving" /> },
      ])}
    </>
  );
};

// TODO:
// robot 이미지 사이즈 줄여야 할 수도
