import { useTheme, Box, Typography } from "@mui/material";
import { capitalize } from "../utils";

export const MiniPaper = ({ color = "blue", icon, content }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: `${28 / 19.2}vw`, // 28,
        height: `${164 / 12}vh`, // 164,
        background: "#ffffff",
        borderRadius: `${16 / 12}vh`, //  16,
        color: theme.palette.text.secondary,
        padding: `${28 / 12}vh ${28 / 19.2}vw`, //28,
        boxShadow: theme.shadows[4],
        "& > .iconWrapper": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: `${116 / 19.2}vw`, //  116,
          height: `${116 / 12}vh`, // 116,
          borderRadius: `${20 / 12}vh`, // 20,
          backgroundColor: "#ECF0F6",
          "& > div": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${88 / 19.2}vw`, // 88,
            height: `${88 / 12}vh`, // 88,
            borderRadius: "50%",
            background: theme.palette[`light${capitalize(color)}`],
            "& > img": {
              width: `${48 / 19.2}vw`, // 48,
              height: `${48 / 12}vh`, //  48,
            },
          },
        },
        "& > .contentWrapper": {
          flex: 1,
          fontSize: `${40 / 12}vh`, //  40,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "pre",
          textAlign: "center",
        },
      }}
    >
      <div className="iconWrapper">
        <div>{icon}</div>
      </div>
      <Typography className="contentWrapper">{content}</Typography>
    </Box>
  );
};
