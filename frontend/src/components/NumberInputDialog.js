import { useState, useEffect } from "react";
import { Button, Dialog, Typography, useTheme } from "@mui/material";

import { BackspaceIcon } from "./icons";
import { playButtonClickSound } from "../utils";
import { minMappingPasswordLength } from "../constants";

export const NumberInputDialog = ({
  open,
  title = "로봇 IP 입력",
  subTitle = "",
  placeholder = "",
  initValue = "",
  action = () => {},
  onClose: handleClose,
}) => {
  const [value, setValue] = useState(initValue);
  const theme = useTheme();

  useEffect(() => {
    if (open) setValue(initValue);
  }, [open, initValue]);

  const handleKeyClick = (newValue) => () => {
    playButtonClickSound();
    setValue((value) => value + newValue);
  };
  const handleBackspaceClick = () => {
    playButtonClickSound();
    setValue((value) => value.slice(0, -1));
  };
  const handleCancelClick = () => {
    playButtonClickSound();
    handleClose();
  };
  const handleConfirmClick = () => {
    playButtonClickSound();
    setValue("");
    action(value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: `${712 / 19.2}vw`, //  712,
          maxWidth: `${712 / 19.2}vw`, // 712,
          padding: `${40 / 12}vh ${40 / 19.2}vw`, // 40,
          borderRadius: `${16 / 12}vh`, // 16,
          background: theme.palette.grey[850],
          "& > .titleWrapper": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: `${36 / 12}vh`, // 36,
            "& > .title": {
              fontSize: `${36 / 12}vh`, // 36,
            },
            "& > .subTitle": {
              fontSize: `${36 / 12}vh`, //  36,
              color: theme.palette.grey[400],
            },
          },
          "& > .textField": {
            display: "flex",
            alignItems: "center",
            padding: `${20 / 12}vh ${20 / 19.2}vw`, // 20,
            marginBottom: `${28 / 12}vh`, // 28,
            background: "#ffffff",
            borderRadius: `${16 / 12}vh`, //  16,
            "& > .placeholder": {
              fontSize: `${36 / 12}vh`, // 36,
              color: theme.palette.grey[500],
              whiteSpace: "pre",
            },
            "& > .input": {
              fontSize: `${36 / 12}vh`, // 36,
              color: theme.palette.text.secondary,
            },
          },
          "& > .keypad": {
            display: "grid",
            gridTemplateColumns: `repeat(3, 1fr)`,
            gap: `${16 / 12}vh ${16 / 19.2}vw`, // 16,
            marginBottom: `${28 / 12}vh`, // 28,
          },
          "& > .actions": {
            display: "flex",
            gap: `${16 / 19.2}vw`, //  16,
            "& > button": {
              flex: 1,
              height: `${100 / 12}vh`, // 100,
              borderRadius: `${12 / 12}vh`, //  12,
              fontSize: `${32 / 12}vh`, // 32,
            },
            "& > .cancelButton": {
              color: "#5668F9",
              background: "linear-gradient(#FFFFFF, #E0E0E0)",
            },
            "& > .confirmButton": {
              color: "#ffffff",
              background: "linear-gradient(#4987F8, #5668F9)",
              "&:disabled": {
                color: " #808083",
                background: "linear-gradient(#375081, #3C4481)",
              },
            },
          },
        },
      }}
    >
      <div className="titleWrapper">
        <Typography className="title">{title}</Typography>
        <Typography className="subTitle">{subTitle}</Typography>
      </div>
      <div className="textField">
        {value ? (
          <Typography className="input">{value}</Typography>
        ) : (
          <Typography className="placeholder">{placeholder}</Typography>
        )}
      </div>
      <div className="keypad">
        {[
          {
            label: "1",
            disabled: false,
            onClick: handleKeyClick("1"),
          },
          {
            label: "2",
            disabled: false,
            onClick: handleKeyClick("2"),
          },
          {
            label: "3",
            disabled: false,
            onClick: handleKeyClick("3"),
          },
          {
            label: "4",
            disabled: false,
            onClick: handleKeyClick("4"),
          },
          {
            label: "5",
            disabled: false,
            onClick: handleKeyClick("5"),
          },
          {
            label: "6",
            disabled: false,
            onClick: handleKeyClick("6"),
          },
          {
            label: "7",
            disabled: false,
            onClick: handleKeyClick("7"),
          },
          {
            label: "8",
            disabled: false,
            onClick: handleKeyClick("8"),
          },
          {
            label: "9",
            disabled: false,
            onClick: handleKeyClick("9"),
          },
          {
            label: "",
            disabled: true,
          },
          {
            label: "0",
            disabled: false,
            onClick: handleKeyClick("0"),
          },
          {
            label: <BackspaceIcon />,
            disabled: !value,
            onClick: handleBackspaceClick,
          },
        ].map((props, idx) => (
          <InputKey key={idx} {...props} />
        ))}
      </div>
      <div className="actions">
        <Button className="cancelButton" onClick={handleCancelClick}>
          취소
        </Button>
        <Button
          className="confirmButton"
          onClick={handleConfirmClick}
          disabled={value.length < minMappingPasswordLength}
        >
          완료
        </Button>
      </div>
    </Dialog>
  );
};

export const InputKey = ({ label, disabled, onClick: handleClick }) => {
  return (
    <Button
      disabled={disabled}
      onClick={handleClick}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: `${100 / 12}vh`, // 100,
        borderRadius: `${16 / 12}vh`, //  16,
        boxShadow: `0px 3px 8px #00000029`,
        background: "#444449",
        fontSize: `${36 / 12}vh`, // 36,
        fontWeight: 400,
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#444449",
        },
        "&:disabled": {
          color: "#9E9E9E",
          background: "#35353A",
        },
        "& svg": {
          width: `${36 / 12}vh`, // 36,
          height: `${36 / 12}vh`, // 36,
        },
      }}
    >
      {label}
    </Button>
  );
};
