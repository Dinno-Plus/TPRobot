import { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import { BottomButton } from "./";
import { blinkInterval } from "../constants";
import { MapMarkerRadiusIcon } from "./icons";
import { useInterval } from "../hooks";

export const ProgressRightPanel = ({
  progressPaperProps,
  leftBottomButtonProps,
  rightBottomButtonProps,
}) => {
  return (
    <>
      <ProgressPaper {...progressPaperProps} />
      <Box
        sx={{
          display: "flex",
          gap: `${28 / 19.2}vw`, //  28,
          "& > button": { flex: 1 },
        }}
      >
        <BottomButton labelAlign="left" {...leftBottomButtonProps} />
        <BottomButton labelAlign="left" {...rightBottomButtonProps} />
      </Box>
    </>
  );
};

const ProgressPaper = ({
  goal = "10",
  nextGoal = "ABCDEFG",
  pause = true,
  color = "blue",
  progress = 20,
}) => {
  const [pauseBlink, setPauseBlink] = useState(false);
  const theme = useTheme();

  useInterval(() => setPauseBlink((b) => !b), blinkInterval);

  return (
    <Box
      sx={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        margin: `${20 / 12}vh ${20 / 19.2}vw`, //`${20}px`,
        "& > .pause": {
          fontSize: `${48 / 12}vh`, //  48,
          color: pauseBlink ? "white" : theme.palette.text.lightGrey,
          height: `${72 / 12}vh`, //  72,
          marginBottom: `${8 / 12}vh`, // 8,
        },
        "& > .goal": {
          fontSize: `${152 / 12}vh`, //  152,
          fontWeight: 700,
          marginBottom: `${72 / 12}vh`, //  72,
        },
        "& > .nextGoal": {
          display: "flex",
          alignItems: "center",
          color: theme.palette.text.lightGrey,
          "& > svg": {
            width: `${40 / 19.2}vw`, // 40,
            height: `${40 / 12}vh`, // 40,
            marginRight: `${16 / 19.2}vw`, //  16,
          },
          "& > p": {
            fontSize: `${32 / 12}vh`, //  32,
          },
        },
        "& > .circularProgress": {
          position: "absolute",
          width: `${800 / 19.2}vw`, // 800,
          height: `${800 / 12}vh`, //800,
          transform: "rotate(-90deg)",
          "& > .background": {
            fill: "none",
            stroke: theme.palette[color],
            strokeWidth: 2,
            opacity: 0.2,
          },
          "& > .progress": {
            fill: "none",
            strokeLinecap: "round",
            stroke: theme.palette[color],
            strokeDasharray: "100 100",
            strokeWidth: 0.5,
            strokeDashoffset: 100 - progress,
          },
        },
      }}
    >
      <Typography className="pause">{pause ? "일시 정지" : " "}</Typography>
      <Typography className="goal">{goal}</Typography>
      <div className="nextGoal">
        <MapMarkerRadiusIcon />
        <Typography>
          다음 목적지: <b>{nextGoal ? nextGoal : "없음"}</b>
        </Typography>
      </div>
      <svg className="circularProgress" viewBox="-18 -18 36 36">
        <filter id="blur">
          <feGaussianBlur in="source" stdDeviation="0.5" />
        </filter>
        <circle className="background" r="16" filter="url(#blur)" />
        <circle className="progress" r="16" />
      </svg>
    </Box>
  );
};
