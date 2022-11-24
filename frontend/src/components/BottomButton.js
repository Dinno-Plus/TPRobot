import { Button, useTheme } from "@mui/material";

export const BottomButton = ({
  label = "label",
  labelAlign = "center",
  color = "blue",
  icon,
  disabled,
  onClick: handleClick,
}) => {
  const theme = useTheme();
  return (
    <Button
      className={`${color} ${disabled && "disabled"}`}
      onClick={handleClick}
      disabled={disabled}
      sx={{
        fontSize: `${36 / 12}vh`, // 36,
        fontWeight: 500,
        height: `${116 / 12}vh`, // 116,
        padding: `${16 / 12}vh ${16 / 19.2}vw`, // 16,
        borderRadius: `${24 / 12}vh`, // 24,
        boxShadow: theme.shadows[4],
        "& > .label": {
          marginLeft: labelAlign === "left" ? `${24 / 19.2}vw` : 0, // 24 : 0,
          marginRight: labelAlign === "left" ? "auto" : 0,
        },
        "&.disabled": {
          filter: "brightness(50%)",
          color: "white",
        },
        "& .iconWrapper": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          right: `${16 / 19.2}vw`, // 16,
          width: `${84 / 19.2}vw`, // 84,
          height: `${84 / 12}vh`, //  84,
          padding: `${16 / 12}vh ${16 / 19.2}vw`, // 16,
          borderRadius: `${16 / 12}vh`, //  16,
          "& > svg": {
            width: `${48 / 19.2}vw`, //  48,
            height: `${48 / 12}vh`, // 48,
          },
        },
        "&.blue": {
          background: theme.palette.gradient.blue,
          "& > .iconWrapper": { background: theme.palette.gradient.darkBlue },
        },
        "&.green": {
          background: theme.palette.gradient.green,
          "& > .iconWrapper": { background: theme.palette.gradient.darkGreen },
        },
        "&.yellow": {
          background: theme.palette.gradient.yellow,
          "& > .iconWrapper": { background: theme.palette.gradient.darkYellow },
        },
        "&.purple": {
          background: theme.palette.gradient.purple,
          "& > .iconWrapper": { background: theme.palette.gradient.darkPurple },
        },
        "&.red": {
          background: theme.palette.gradient.red,
          "& > .iconWrapper": { background: theme.palette.gradient.darkRed },
        },
        "&.whiteBlue, &.whiteGreen, &.whiteYellow, &.whitePurple": {
          background: "#FFFFFF",
          "&:hover": { backgroundColor: "#FFFFFF" },
          "&:hover.Mui-disabled": { backgroundColor: "#FFFFFF" },
          "& .iconWrapper": {
            color: "#bebebe",
            background: "linear-gradient(180deg, #e0e0e5, #FFFFFF)",
          },
        },
        "&.whiteBlue": { color: "#1069FF" },
        "&.whiteGreen": { color: "#00C95C" },
        "&.whiteYellow": { color: "#E0A900" },
        "&.whitePurple": { color: "#5306FF" },
      }}
    >
      <span className="label">{label}</span>
      {icon && <div className="iconWrapper">{icon}</div>}
    </Button>
  );
};
