import { useTheme, Box } from "@mui/material";

export const TwoPanelLayout = ({ leftPanel, rightPanel }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        "& > div": { flex: 1 },
        "& > .rightPanel": {
          width: "50%",
          display: "flex",
          flexDirection: "column",
          gap: `${24 / 12}vh`, //  24,
          boxShadow: theme.shadows[12],
          border: `${1}px solid ${theme.palette.grey[850]}`,
          borderRadius: `${16 / 12}vh`, //  16,
          padding: `${28 / 12}vh ${28 / 19.2}vw`, // 28,
          backgroundColor: theme.palette.grey[900],
        },
      }}
    >
      <div className="leftPanel">{leftPanel}</div>
      <div className="rightPanel">{rightPanel}</div>
    </Box>
  );
};
