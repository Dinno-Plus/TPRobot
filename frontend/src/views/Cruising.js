import { useState, useLayoutEffect, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";

import {
  DestinationGridRightPanel,
  FullPaperRightPanelOld,
  ProgressRightPanel,
  GoingDialog,
} from "../components";
import {
  PlayIcon,
  CloseThickIcon,
  PauseIcon,
  CruisingIcon,
} from "../components/icons";
import { playButtonClickSound } from "../utils";
import {
  robotImgs,
  loadingImg,
  emergencyImg,
  chargingImg,
  goingImg,
} from "../constants";
import { TwoPanelLayout } from "../layouts";
import { mapsActions, robotActions } from "../store";

export const Cruising = () => {
  const { state, mode, goal, nextGoal, progress, pause, robotDirection } =
    useSelector((state) => state.robot);
  const { numDrawers, numTrays } = useSelector(
    (state) => state.managerSettings
  );
  const [destinationsPlus, setDestinationsPlus] = useState([]);
  const destinations = useSelector(
    (state) => state.maps.maps.find((m) => m.selected).destinations
  );
  const [goals, setGoals] = useState([]);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(mapsActions.get());
  }, [dispatch]);
  useLayoutEffect(() => {
    setDestinationsPlus(
      destinations.map((d) => ({
        ...d,
        selected: false,
        order: [],
      }))
    );
  }, [destinations]);
  useEffect(() => {
    if (state === "arrived" && mode === "cruising") {
      dispatch(robotActions.set({ state: "going", goal: nextGoal }));
    }
  }, [state, mode, nextGoal, dispatch]);
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

  const handleDestinationClick = useCallback(
    (clicked) => {
      const lastOrder = goals.length;
      if (
        (!clicked.selected ||
          lastOrder !== clicked.order[clicked.order.length - 1]) &&
        clicked.order.length < 4
      ) {
        playButtonClickSound();
        setGoals((goals) => [
          ...goals,
          { table: clicked.name, tray: [...new Array(4)].map((_, i) => i + 1) },
        ]);
        setDestinationsPlus((ds) =>
          ds.map((d) =>
            d.name === clicked.name
              ? {
                  ...d,
                  selected: true,
                  order: [...d.order, lastOrder + 1],
                }
              : d
          )
        );
      } else if (lastOrder === clicked.order[clicked.order.length - 1]) {
        playButtonClickSound();
        setGoals((goals) => goals.slice(0, -1));
        setDestinationsPlus((ds) =>
          ds.map((d) =>
            d.name === clicked.name
              ? {
                  ...d,
                  selected: clicked.order.length === 1 ? false : true,
                  order: d.order.slice(0, -1),
                }
              : d
          )
        );
      }
    },
    [goals.length]
  );

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
    dispatch(robotActions.set({ mode: "cruising", goals }));
  };
  const handlePauseClick = () => {
    playButtonClickSound();
    dispatch(robotActions.set({ pause: !pause }));
  };

  let rightPanel;
  if (state === "loading") {
    rightPanel = (
      <FullPaperRightPanelOld
        fullPaperProps={{
          img: loadingImg,
          content1: "준비 중입니다.",
          content2: "잠시만 기다려 주세요.",
        }}
      />
    );
  } else if (state === "emergency") {
    rightPanel = (
      <FullPaperRightPanelOld
        fullPaperProps={{
          img: emergencyImg,
          content1: "비상 버튼이 눌려있습니다.",
          content2:
            "크루즈 운행을 원하시면\n머리 위에 있는 비상 버튼을 풀어 주세요.",
        }}
      />
    );
  } else if (state === "charging") {
    rightPanel = (
      <FullPaperRightPanelOld
        fullPaperProps={{
          img: chargingImg,
          content1: "점검 로봇이 충전 중입니다.",
          content2: "크루즈 운행을 원하시면\n플러그를 콘센트에서 뽑아주세요.",
        }}
      />
    );
  } else if (mode === "serving") {
    rightPanel = (
      <FullPaperRightPanelOld
        fullPaperProps={{
          img: goingImg,
          content1: "점검 로봇이 서빙 운행 중입니다.",
          content2: "크루즈 운행을 원하시면\n현재 서빙 운행을 취소해 주세요.",
        }}
        bottomButtonProps={{
          label: "서빙 운행 취소",
          color: "red",
          icon: <CloseThickIcon />,
          onClick: handleCancelClick,
        }}
      />
    );
  } else if (mode === "calling") {
    rightPanel = (
      <FullPaperRightPanelOld
        fullPaperProps={{
          img: goingImg,
          content1: "점검 로봇이 호출 운행 중입니다.",
          content2: "크루즈 운행을 원하시면\n현재 호출 운행을 취소해 주세요.",
        }}
        bottomButtonProps={{
          label: "호출 운행 취소",
          color: "red",
          icon: <CloseThickIcon />,
          onClick: handleCancelClick,
        }}
      />
    );
  } else if (state === "ready") {
    rightPanel = (
      <DestinationGridRightPanel
        color="green"
        miniPaperProps={{
          icon: <CruisingIcon />,
          content: '목적지를 선택하신 후\n"크루즈 시작" 버튼을 눌러주세요.',
        }}
        destinationGridProps={{
          mapName: "",
          destinations: destinationsPlus,
          badge: "order",
          onClick: handleDestinationClick,
          onChange: null,
          onAdd: null,
        }}
        bottomButtonProps={{
          label: "크루즈 시작",
          labelAlign: "center",
          icon: <PlayIcon />,
          disabled: goals.length < 2,
          onClick: handleStartClick,
        }}
      />
    );
  } else if (state === "going" || state === "arrived") {
    rightPanel = (
      <ProgressRightPanel
        progressPaperProps={{
          goal: goal.table,
          nextGoal: nextGoal.table,
          pause,
          color: "green",
          progress,
        }}
        leftBottomButtonProps={{
          color: "red",
          label: nextGoal.table ? "크루즈 취소" : "홈 복귀 취소",
          icon: <CloseThickIcon />,
          onClick: handleCancelClick,
        }}
        rightBottomButtonProps={{
          color: pause ? "green" : "whiteGreen",
          label: pause ? "다시 시작" : "일시 정지",
          icon: pause ? <PlayIcon /> : <PauseIcon />,
          onClick: handlePauseClick,
        }}
      />
    );
  }

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
      {(state === "going" || state === "arrived") &&
        (mode === "cruising" || mode === "none") &&
        !pause && (
          <GoingDialog
            goal={goal.table}
            nextGoal={nextGoal.table}
            color="green"
            progress={progress}
            onClick={handlePauseClick}
          />
        )}
    </>
  );
};
