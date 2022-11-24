import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme, Box, Button } from "@mui/material";

import {
  DestinationGridRightPanel,
  FullPaperRightPanelOld,
  ProgressRightPanel,
  GoingDialog,
  ArrivedRightPanel,
} from "../components";
import {
  PlayIcon,
  CloseThickIcon,
  PauseIcon,
  ServingIcon,
} from "../components/icons";
import { playButtonClickSound } from "../utils";
import {
  trayOffImg,
  trayOnImg,
  robotImgs,
  loadingImg,
  emergencyImg,
  chargingImg,
  goingImg,
  confirmedImg,
  blinkInterval,
  servingArrivedConfirmTimeout,
} from "../constants";
import { TwoPanelLayout } from "../layouts";
import { mapsActions, robotActions } from "../store";
import { useInterval } from "../hooks";

export const Serving = () => {
  const [isTransitionEnded, setIsTransitionEnded] = useState(false);
  const [arrivedBlink, setArrivedBlink] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const {
    state,
    mode,
    goal,
    nextGoal,
    progress,
    pause,
    trays,
    robotDirection,
  } = useSelector((state) => state.robot);
  const { numDrawers, numTrays } = useSelector(
    (state) => state.managerSettings
  );
  const [destinationsPlus, setDestinationsPlus] = useState([]);
  const destinations = useSelector(
    (state) => state.maps.maps.find((m) => m.selected).destinations
  );
  const theme = useTheme();
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
    if (state === "going") {
      setIsConfirmed(false);
    }
    if (state === "arrived" && mode === "serving" && !nextGoal.table) {
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
      dispatch(
        robotActions.change({
          name: "trays",
          value: new Array(numTrays)
            .fill({ selected: false, table: "" })
            .map((t, i) => (i === 0 ? { selected: true, table: "" } : t)),
        })
      );
    }
  }, [state, mode, nextGoal.table, dispatch, numTrays]);
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

  useInterval(() => setArrivedBlink((b) => !b), blinkInterval);

  const handleTransitionEnd = () => setIsTransitionEnded(true);

  const handleTrayClick = (idx) => {
    playButtonClickSound();
    let newTrays = [...trays];
    if (trays[idx].selected) {
      //선택 되어있던 애 클릭 = 선택 취소 + 테이블 초기화
      newTrays.splice(idx, 1, { selected: false, table: "" });
    } else {
      //선택 안 되어있던 애 클릭
      if (trays.filter((tray) => tray.selected).some((tray) => tray.table)) {
        // 기존에 선택 되어 있던 애들 중 테이블이 있는 애가 있으면 모두 선택 취소하고
        // 기존에 선택 되어 있었 애들 중 테이블이 있는 애가 없으면 그대로 선택 상태로 나두고
        newTrays = newTrays.map((tray) => ({ ...tray, selected: false }));
      }
      // 해당 애 선택
      newTrays.splice(idx, 1, { selected: true, table: "" });
    }

    setDestinationsPlus((ds) => ds.map((d) => ({ ...d, selected: false })));
    dispatch(robotActions.change({ name: "trays", value: newTrays }));
  };
  const handleDestinationClick = useCallback(
    (clicked) => {
      if (trays.some((t) => t.selected)) {
        playButtonClickSound();
        setDestinationsPlus((ds) =>
          ds.map((d) =>
            d.name === clicked.name
              ? { ...d, selected: !d.selected }
              : { ...d, selected: false }
          )
        );
        dispatch(
          robotActions.change({
            name: "trays",
            value: trays.map((tray) =>
              tray.selected
                ? { ...tray, table: clicked.selected ? "" : clicked.name }
                : tray
            ),
          })
        );
      }
    },
    [dispatch, trays]
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
    dispatch(
      robotActions.change({
        name: "trays",
        value: new Array(numTrays)
          .fill({ selected: false, table: "" })
          .map((t, i) => (i === 0 ? { selected: true, table: "" } : t)),
      })
    );
  };
  const handleStartClick = () => {
    playButtonClickSound();
    dispatch(
      robotActions.set({
        mode: "serving",
        goals: trays.reduce((pre, cur, i) => {
          if (cur.table === "") return pre;

          const table = cur.table;
          const index = pre.findIndex((p) => p.table === table);
          if (index > -1) {
            return pre.map((p, j) =>
              j === index ? { table, tray: [...pre[index].tray, i + 1] } : p
            );
          } else {
            return [...pre, { table, tray: [i + 1] }];
          }
        }, []),
      })
    );
    dispatch(
      robotActions.change({
        name: "trays",
        value: trays.map((t) => ({ ...t, selected: false })),
      })
    );
    setDestinationsPlus((ds) => ds.map((d) => ({ ...d, selected: false })));
  };
  const handlePauseClick = () => {
    playButtonClickSound();
    dispatch(robotActions.set({ pause: !pause }));
  };
  const handleConfirmClick = () => {
    playButtonClickSound();
    setIsConfirmed(true);
    setTimeout(() => {
      dispatch(robotActions.set({ state: "going", goal: nextGoal }));
    }, servingArrivedConfirmTimeout);
  };

  const showTrays = robotDirection === "left" && isTransitionEnded;
  const isTrayActive = showTrays && state === "ready";

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
            onTransitionEnd={handleTransitionEnd}
            className={`robotD${numDrawers}T${numTrays}`}
            sx={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              background: `url(${
                robotImgs[`robotD${numDrawers}T${numTrays}`]
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${(843 * 20) / 19.2}vw ${(968 * 1.2) / 12}vh`, //"2000% 120%"
              backgroundPositionY: `${-60 / 12}vh`, // -60,
              backgroundPositionX:
                robotDirection === "front"
                  ? `${-843 / 2 / 19.2}vw` //  -843 / 2
                  : `${(-843 / 2 - (843 * 2 - 16) * 9) / 19.2}vw`, // -843 / 2 - (843 * 2 - 16) * 9,
              transition: `background-position-x steps(9, end) 0.5s`,

              "&.robotD0T2": {
                "& .tray:nth-of-type(1)": { marginTop: `${348 / 12}vh` }, // 340
                "& .tray:nth-of-type(n+2)": { marginTop: `${200 / 12}vh` }, // 184
              },
              "&.robotD0T3": {
                "& .tray:nth-of-type(1)": { marginTop: `${236 / 12}vh` }, // 228
                "& .tray:nth-of-type(2)": { marginTop: `${146 / 12}vh` }, // 130
                "& .tray:nth-of-type(3)": { marginTop: `${88 / 12}vh` }, // 72
              },
              "&.robotD0T5": {
                "& .tray:nth-of-type(1)": { marginTop: `${184 / 12}vh` }, // 176
                "& .tray:nth-of-type(n+2)": { marginTop: `${32 / 12}vh` }, // 16
              },
              "&.robotD1T2": {
                "& .tray:nth-of-type(1)": { marginTop: `${288 / 12}vh` }, // 280
                "& .tray:nth-of-type(n+2)": { marginTop: `${140 / 12}vh` }, // 124
              },
              "&.robotD1T3": {
                "& .tray:nth-of-type(1)": { marginTop: `${184 / 12}vh` }, // 176
                "& .tray:nth-of-type(2)": { marginTop: `${96 / 12}vh` }, // 80
                "& .tray:nth-of-type(3)": { marginTop: `${84 / 12}vh` }, // 68
              },
              "&.robotD1T4": {
                "& .tray:nth-of-type(1)": { marginTop: `${184 / 12}vh` }, // 176
                "& .tray:nth-of-type(n+2)": { marginTop: `${32 / 12}vh` }, // 16
              },

              "& .tray": {
                marginLeft: `${180 / 19.2}vw`, // 180,
                display: showTrays ? "flex" : "none",
                alignItems: "center",
                gap: `${8 / 19.2}vw`, //  8,
                padding: 0,
                "& > img": {
                  opacity: 0.95,
                  height: `${88 / 12}vh`, // 88,
                },
                "& > .dot": {
                  background: theme.palette.common.white,
                  width: `${4 / 19.2}vw`, //  4,
                  height: `${4 / 12}vh`, // 4,
                  borderRadius: "50%",
                },
                "& > .speechBubble": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: `${36 / 12}vh`, //  36,
                  fontWeight: 700,
                  marginLeft: `${16 / 19.2}vw`, //  16,
                  width: `${240 / 19.2}vw`, //  240,
                  height: `${88 / 12}vh`, // 88,
                  position: "relative",
                  color: theme.palette.text.secondary,
                  background: theme.palette.common.white,
                  borderRadius: `${16 / 12}vh`, //  16,
                  "&:after": {
                    content: "''",
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    width: 0,
                    height: 0,
                    border: `${16 / 12}vh solid transparent`,
                    borderRightColor: theme.palette.common.white,
                    borderLeft: 0,
                    marginTop: `${-16 / 12}vh`, //  -16,
                    marginLeft: `${-16 / 19.2}vw`, //  -16,
                  },
                },
              },
            }}
          />
        }
        rightPanel={rightPanel}
      />
      {state === "going" &&
        (mode === "serving" || mode === "none") &&
        !pause && (
          <GoingDialog
            goal={goal.table}
            nextGoal={nextGoal.table}
            color="blue"
            progress={progress}
            onClick={handlePauseClick}
          />
        )}
    </>
  );
};
