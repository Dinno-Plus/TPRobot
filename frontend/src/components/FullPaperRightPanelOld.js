import { Box, Typography, useTheme } from "@mui/material";
import { BottomButton } from "./";

export const FullPaperRightPanelOld = ({
  fullPaperProps,
  bottomButtonProps,
}) => {
  return (
    <>
      <FullPaper {...fullPaperProps} />
      {bottomButtonProps && <BottomButton {...bottomButtonProps} />}
    </>
  );
};

const FullPaper = ({ img, content1, content2 }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: theme.palette.common.white,
        borderRadius: `${16 / 12}vh`, //  16,
        padding: `${28 / 12}vh ${28 / 19.2}vw`, //28,
        "& > div": {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: theme.palette.text.secondary,
          backgroundColor: "#ECF0F6",
          borderRadius: `${24 / 12}vh`, // 24,
          "& > img": {
            height: `${240 / 12}vh`, //  240,
            marginBottom: `${60 / 12}vh`, // 60,
          },
          "& > h1": {
            fontSize: `${40 / 12}vh`, //  40,
            fontWeight: 700,
            marginBottom: `${80 / 12}vh`, // 80,
            whiteSpace: "pre",
            textAlign: "center",
          },
          "& > h2": {
            fontSize: `${40 / 12}vh`, // 40,
            fontWeight: 400,
            whiteSpace: "pre",
            textAlign: "center",
            lineHeight: 1.5,
          },
        },
      }}
    >
      <div>
        <img src={img} alt="img" />
        <Typography variant="h1">{content1}</Typography>
        <Typography variant="h2">{content2}</Typography>
      </div>
    </Box>
  );
};
