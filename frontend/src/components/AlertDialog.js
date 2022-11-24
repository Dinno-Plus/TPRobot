import { Button, Dialog, Typography, useTheme } from "@mui/material";

import { AlertCircleIcon, AlertIcon, InformationIcon } from "./icons";

export const AlertDialog = ({
  open,
  title,
  content,
  type,
  progress,
  confirmButtonProps,
  onClose: handleClose,
}) => {
  const theme = useTheme();

  let typeIcon;
  if (type === "information") {
    typeIcon = <InformationIcon />;
  } else if (type === "warning") {
    typeIcon = <AlertIcon />;
  } else {
    typeIcon = <AlertCircleIcon />;
  }

  let contentMarginBottom;
  if (!isNaN(progress)) {
    // with progress
    contentMarginBottom = `${28 / 12}vh`; // 28;
  } else if (content?.props?.children.length > 2) {
    // content > 2 lines
    contentMarginBottom = `${40 / 12}vh`; //  40;
  } else {
    // content = 1 lines
    contentMarginBottom = `${88 / 12}vh`; //  88;
  }

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          background: theme.palette.grey[850],
          padding: `${40 / 12}vh ${40 / 19.2}vw`, // 40,
          paddingLeft: `${52 / 19.2}vw`, //  52,
          width: `${940 / 19.2}vw`, //  940,
          borderRadius: `${20 / 12}vh`, // 20,
          maxWidth: "none",
          "& > .typeIndicator": {
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${20 / 12}vh`, //  20,
            "&.information": { background: "#039BE5" },
            "&.warning": { background: "#FB8C00" },
            "&.error": { background: "#E53935" },
          },
          "& > .title": {
            display: "flex",
            alignItems: "center",
            fontSize: `${40 / 12}vh`, // 40,
            fontWeight: 700,
            marginBottom: `${36 / 12}vh`, // 36,
            "& > svg": {
              width: `${56 / 19.2}vw`, //  56,
              height: `${56 / 12}vh`, //  56,
              marginRight: `${16 / 19.2}vw`, //  16,
            },
            "&.information > svg": { color: "#039BE5" },
            "&.warning > svg": { color: "#FB8C00" },
            "&.error > svg": { color: "#E53935" },
          },
          "& > .content": {
            fontSize: `${36 / 12}vh`, //  36,
            marginBottom: `${88 / 12}vh`, //  88,
            whiteSpace: "pre",
          },
          "& > .progress": {
            marginBottom: `${40 / 12}vh`, // 40,
            background: "#1B1A20",
            width: "100%",
            height: `${20 / 12}vh`, // 20,
            borderRadius: `${20 / 12}vh`, //  20,
            overflow: "hidden",
            "& > div": {
              height: "100%",
              borderRadius: `${20 / 12}vh`, //  20,
            },
            "&.information > div": {
              background: "linear-gradient(#03A9F4, #039BE5)",
            },
            "&.warning > div": {
              background: "linear-gradient(#FB8C00, #F57F17)",
            },
            "&.error > div": {
              background: "linear-gradient(#F44336, #E53935)",
            },
          },
          "& > .confirmButton": {
            width: `${148 / 19.2}vw`, // 148,
            height: `${76 / 12}vh`, //  76,
            borderRadius: `${12 / 12}vh`, // 12,
            marginLeft: "auto",
            color: "#ffffff",
            fontSize: `${36 / 12}vh`, //  36,
            fontWeight: 400,
            "&.information": {
              background: "linear-gradient(#03A9F4, #039BE5)",
            },
            "&.warning": { background: "linear-gradient(#FB8C00, #F57F17)" },
            "&.error": { background: "linear-gradient(#F44336, #E53935)" },
            "&:disabled": { color: "#ffffff", filter: "brightness(50%)" },
          },
        },
      }}
      onClose={handleClose}
    >
      <div className={`typeIndicator ${type}`} />
      <Typography variant="h1" className={`title ${type}`}>
        {typeIcon}
        {title}
      </Typography>
      <Typography
        className="content"
        style={{ marginBottom: contentMarginBottom }}
      >
        {content}
      </Typography>
      {!isNaN(progress) && (
        <div className={`progress ${type}`}>
          <div style={{ width: `${progress}%` }} />
        </div>
      )}
      <Button className={`confirmButton ${type}`} {...confirmButtonProps}>
        확인
      </Button>
    </Dialog>
  );
};
