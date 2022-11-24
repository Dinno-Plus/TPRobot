import { useSelector } from "react-redux";
import { useTheme, Box, Typography } from "@mui/material";

export const HeaderBattery = () => {
  const theme = useTheme();
  const battery = useSelector((state) => state.robot.battery);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        "& > p": {
          width: `${56 / 19.2}vw`, //  56,
          marginRight: `${8 / 19.2}vw`, // 8,
          fontSize: `${20 / 12}vh`, // 20,
          textAlign: "right",
        },
        "& .outerBar": {
          width: `${56 / 19.2}vw`, //  56,
          height: `${28 / 12}vh`, // 28,
          background: theme.palette.common.black,
          borderRadius: `${4 / 12}vh`, //  4,
          overflow: "hidden",
        },
        "& .innerBar": {
          height: "100%",
          background: "MediumAquaMarine",
          "&.low": { background: "tomato" },
        },
        "& .cap": {
          marginLeft: `${-1 / 19.2}vw`, //  -1,
          width: `${8 / 19.2}vw`, // 8,
          height: `${16 / 12}vh`, //  16,
          borderBottomRightRadius: `${2 / 12}vh`, //  2,
          borderTopRightRadius: `${2 / 12}vh`, //  2,
        },
      }}
    >
      <Typography>{battery}%</Typography>
      <div className="outerBar">
        <div
          className={battery < 20 ? "innerBar low" : "innerBar"}
          style={{ width: `${battery}%` }}
        />
      </div>
      <div
        className="cap"
        style={{ background: battery < 100 ? "black" : "MediumAquaMarine" }}
      />
    </Box>
  );
};
