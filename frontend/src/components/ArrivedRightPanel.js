import { Box, Typography, useTheme } from "@mui/material";

export const ArrivedRightPanel = ({
  goal = "ABCDEFG",
  color = "blue",
  text = "hello",
  onClick = () => {},
}) => {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        margin: `${20 / 12}vh ${20 / 19.2}vw`, //`${20}px`,
        cursor: "pointer",
        "& > .goal": {
          marginTop: `${16 / 12}vh`, //  16,
          fontSize: `${160 / 12}vh`, // 160,
          fontWeight: 700,
          marginBottom: `${44 / 12}vh`, // 44,
        },
        "& > .text": {
          fontSize: `${40 / 12}vh`, //  40,
          textAlign: "center",
        },
        "& > .circularProgress": {
          position: "absolute",
          width: `${900 / 19.2}vw`, //  900,
          height: `${900 / 12}vh`, // 900,
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
            strokeWidth: 0.5,
          },
        },
      }}
    >
      <Typography className="goal">{goal}</Typography>
      <Typography className="text">{text}</Typography>
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
