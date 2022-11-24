import { Box, Typography, useTheme } from "@mui/material";
import { layoutBgImg } from "../constants";
import { MapMarkerRadiusIcon } from "./icons";

export const GoingDialog = ({
  goal = "10",
  nextGoal = "ABCDEFG",
  color = "blue",
  progress = 20,
  onClick: handleClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `url(${layoutBgImg})`,
        backgroundSize: "100% 100%",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "& > .goal": {
          fontSize: `${200 / 12}vh`, // 200,
          fontWeight: 700,
          marginBottom: `${72 / 12}vh`, // 72,
        },
        "& > .nextGoal": {
          display: "flex",
          alignItems: "center",
          color: theme.palette.text.lightGrey,
          "& > svg": {
            width: `${48 / 19.2}vw`, //  48,
            height: `${48 / 12}vh`, //  48,
            marginRight: `${16 / 19.2}vw`, // 16,
          },
          "& > p": {
            fontSize: `${40 / 12}vh`, //  40,
          },
        },
        "& > .pause": {
          position: "absolute",
          bottom: `${60 / 12}vh`, //  60,
          fontSize: `${32 / 12}vh`, //  32,
          color: theme.palette.text.lightGrey,
        },
        "& > .circularProgress": {
          position: "absolute",
          top: `${20 / 12}vh`, //  20,
          width: `${1060 / 19.2}vw`, //  1060,
          height: `${1060 / 12}vh`, //  1060,
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
            strokeWidth: 0.6,
            strokeDashoffset: 100 - progress,
          },
        },
      }}
    >
      <Typography className="goal">{goal}</Typography>
      <div className="nextGoal">
        <MapMarkerRadiusIcon />
        <Typography>
          다음 목적지: <b>{nextGoal ? nextGoal : "없음"}</b>
        </Typography>
      </div>
      <Typography className="pause">
        일시 정지 하려면 화면을 터치해 주세요.
      </Typography>
      <svg className="circularProgress" viewBox="-18 -18 36 36">
        <filter id="blur">
          <feGaussianBlur in="source" stdDeviation="2" />
        </filter>
        <circle className="background" r="16" filter="url(#blur)" />
        <circle className="progress" r="16" />
      </svg>
    </Box>
  );
};
