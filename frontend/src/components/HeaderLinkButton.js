import { Link, useMatch } from "react-router-dom";
import { Button, useTheme } from "@mui/material";

export const HeaderLinkButton = ({ to, color, icon, children, ...props }) => {
  const theme = useTheme();
  const match = useMatch(to);

  return (
    <Link to={to}>
      <Button
        className={`${color} ${match && "active"}`}
        {...props}
        sx={{
          display: "flex",
          height: `${84 / 12}vh`, // 84,
          width: `${260 / 19.2}vw`, // 260,
          padding: `${0}vh ${32 / 19.2}vw`, // `${0}px ${32}px`,
          fontSize: `${32 / 12}vh`, //  32,
          borderRadius: `${42 / 12}vh`, // 42,
          fontWeight: 700,
          background: theme.palette.grey[900],
          color: theme.palette.grey[400],
          "&:hover": { background: theme.palette.grey[900] },
          "& > img": {
            width: `${40 / 19.2}vw`, //  40,
            height: `${40 / 12}vh`, //  40,
            filter: "brightness(70%)",
          },
          "& > span": { flex: 1, textAlign: "center" },
          "&.active": {
            color: theme.palette.text.primary,
            "& > img": { filter: "brightness(100%)" },
            "&.red": { background: theme.palette.gradient.red },
            "&.blue": { background: theme.palette.gradient.blue },
            "&.green": { background: theme.palette.gradient.green },
            "&.yellow": { background: theme.palette.gradient.yellow },
            "&.purple": { background: theme.palette.gradient.purple },
          },
        }}
      >
        {icon}
        <span>{children}</span>
      </Button>
    </Link>
  );
};
