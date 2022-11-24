import { Box, useTheme } from "@mui/material";
import { BottomButton } from "./";

export const FullPaperRightPanel = ({ fullPaperProps, bottomButtonProps }) => {
  return (
    <>
      <FullPaper {...fullPaperProps} />
      {bottomButtonProps && <BottomButton {...bottomButtonProps} />}
    </>
  );
};

const FullPaper = ({ color, content }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: `${20 / 12}vh`, //  20,
        border: `${12 / 12}vh solid ${theme.palette[color]}`, //`12px solid ${theme.palette[color]}`,
      }}
    >
      {content}
    </Box>
  );
};
