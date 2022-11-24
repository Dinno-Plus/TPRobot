import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";

import {
  FullPaperRightPanelOld,
  ProgressRightPanel,
  ArrivedRightPanel,
  GoingDialog,
  FullPaperRightPanel,
} from "../components";
import { PlayIcon, CloseThickIcon, PauseIcon } from "../components/icons";
import { playButtonClickSound } from "../utils";
import {
  robotImgs,
  loadingImg,
  emergencyImg,
  chargingImg,
  goingImg,
  blinkInterval,
} from "../constants";
import { TwoPanelLayout } from "../layouts";
import { robotActions } from "../store";
import { useInterval } from "../hooks";

export const Calling = () => {
  const [arrivedBlink, setArrivedBlink] = useState(true);
  const { state, mode, goal, nextGoal, progress, pause, robotDirection } =
    useSelector((state) => state.robot);
  const { numDrawers, numTrays } = useSelector(
    (state) => state.managerSettings
  );
  const theme = useTheme();
  const dispatch = useDispatch();

  useInterval(() => setArrivedBlink((b) => !b), blinkInterval);
  useEffect(() => {
    if (state === "arrived" && mode === "none") {
      dispatch(
        robotActions.set({
          state: "ready",
          mode: "none",
          goal: { table: "", tray: [] },
          nextGoal: { table: "", tray: [] },
          progress: 0,
          pause: false,
        })
      );
    }
  }, [state, mode, dispatch]);

  const handleCancelClick = () => {
    playButtonClickSound();
    dispatch(
      robotActions.set({
        state: "ready",
        mode: "none",
        goal: { table: "", tray: [] },
        nextGoal: { table: "", tray: [] },
        goals: [],
        progress: 0,
        pause: false,
      })
    );
  };
  const handleStartClick = () => {
    playButtonClickSound();
    dispatch(robotActions.set({ mode: "calling" }));
  };
  const handlePauseClick = () => {
    playButtonClickSound();
    dispatch(robotActions.set({ pause: !pause }));
  };
  const handleConfirmClick = () => {
    playButtonClickSound();
    if (!nextGoal.table) {
      dispatch(
        robotActions.set({
          state: "ready",
          mode: "calling",
          goal: { table: "", tray: [] },
          nextGoal: { table: "", tray: [] },
          goals: [],
          progress: 0,
          pause: false,
        })
      );
    } else {
      dispatch(robotActions.set({ state: "going", goal: nextGoal }));
    }
  };

  let rightPanel;
 
    rightPanel = (
      <FullPaperRightPanelOld
        fullPaperProps={{
          img: loadingImg,
          content1: "인더스웰를 준비 중입니다.",
        }}
      />
    );

  return (
    <>
      <TwoPanelLayout
        leftPanel={
          <Box
            className={`robotD${numDrawers}T${numTrays}`}
            sx={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              background: `url(${
                robotImgs[`robotD${numDrawers}T${numTrays}`]
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${(843 * 20) / 19.2}vw ${(968 * 1.2) / 12}vh`, // "2000% 120%",
              backgroundPositionY: `${-60 / 12}vh`, // -60,
              backgroundPositionX:
                robotDirection === "left"
                  ? `${(-843 / 2 - (843 * 2 - 16) * 9) / 19.2}vw` // -843 / 2 - (843 * 2 - 16) * 9
                  : `${-843 / 2 / 19.2}vw`, // -843 / 2,
              transition: `background-position-x steps(9, end) 0.5s`,
            }}
          />
        }
        rightPanel={rightPanel}
      />
      {state === "going" &&
        (mode === "calling" || mode === "none") &&
        !pause && (
          <GoingDialog
            goal={goal.table}
            nextGoal={nextGoal.table}
            color="yellow"
            progress={progress}
            onClick={handlePauseClick}
          />
        )}
    </>
  );
};
