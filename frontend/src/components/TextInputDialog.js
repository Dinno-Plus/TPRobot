import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Button,
  Dialog,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";

import {
  BackspaceIcon,
  CloseThickIcon,
  FormatLetterCaseLowerIcon,
  FormatLetterCaseUpperIcon,
} from "./icons";
import { hangul } from "../utils";

export const TextInputDialog = ({
  open,
  title = "로봇 IP 입력",
  placeholder = "",
  initValue = "",
  confirmText = "추가 +",
  action = () => {},
  onClose: handleClose,
}) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState(initValue);
  const [eng, setEng] = useState(false);
  const [upper, setUpper] = useState(false);
  const [numClick, setNumClick] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (open) setValue(initValue);
  }, [open, initValue]);

  useEffect(() => {
    let clickTimerTimeout = setTimeout(() => {
      setNumClick(0);
    }, 300);

    return () => clearTimeout(clickTimerTimeout);
  }, [numClick]);

  useLayoutEffect(() => {
    if (value.length > 4 && inputRef.current.clientWidth > 160)
      setValue((value) => value.slice(0, -1));
  }, [value]);

  const handleKeyClick = (newValue) => (e) => {
    if (
      numClick + 1 === 2 &&
      "ㅂㅈㄷㄱㅅㅗㅐㅔㅓㅏㅜ".includes(value.slice(-1)) &&
      value.slice(-1) === newValue
    ) {
      const idx = "ㅂㅈㄷㄱㅅㅗㅐㅔㅓㅏㅜ".indexOf(newValue);
      setValue((value) => value.slice(0, -1) + "ㅃㅉㄸㄲㅆㅛㅒㅖㅕㅑㅠ"[idx]);
      setNumClick(0);
    } else {
      setValue((value) => value + newValue);
      setNumClick(1);
    }
  };
  const handleBackspaceClick = () => {
    setValue((value) => hangul.ds(hangul.a(value).slice(0, -1)));
  };
  const handleUpperClick = () => setUpper(!upper);
  const handleLangClick = () => setEng(!eng);
  const handleCancelClick = () => {
    handleClose();
  };
  const handleConfirmClick = () => {
    action(hangul.a(value));
    setTimeout(() => {
      setValue("");
    }, 100);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          maxWidth: "100vw",
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
            "& > .close": {
              color: theme.palette.grey[400],
              "&:hover": { color: "white" },
              "& > svg": {
                width: `${40 / 19.2}vw`, // 40,
                height: `${40 / 12}vh`, // 40,
              },
            },
          },
          "& > .textField": {
            display: "flex",
            alignItems: "center",
            padding: `${20 / 12}vh ${20 / 19.2}vw`, // 20,
            marginBottom: `${28 / 12}vh`,
            background: "#ffffff",
            borderRadius: `${16 / 12}vh`, // 16,
            "& > .placeholder": {
              fontSize: `${36 / 12}vh`, //  36,
              color: theme.palette.grey[500],
              whiteSpace: "pre",
            },
            "& > .input": {
              fontSize: `${36 / 12}vh`, //  36,
              color: theme.palette.text.secondary,
            },
          },
          "& > .keyboard": {
            display: "flex",
            flexDirection: "column",
            gap: `${12 / 12}vh`,
            marginBottom: `${28 / 12}vh`,
            "& > div": {
              display: "flex",
              gap: `${12 / 12}vh`,
              justifyContent: "center",
              "& > button": {
                width: `${eng ? 100 / 12 : 128 / 12}vh`,
                height: `${100 / 12}vh`,
                "&.number": { width: `${100 / 12}vh` },
                "&.special": {
                  flex: 1,
                  width: `${128 / 12}vh`,
                  background: theme.palette.grey[850],
                  fontSize: `${40 / 12}vh`, //  40,
                  "&:hover": {
                    background: theme.palette.grey[850],
                  },
                },
                "&.space": { width: `${700 / 12}vh` },
                "& span": { color: theme.palette.grey[600] },
                "& span.eng": {
                  color: eng ? "white" : theme.palette.grey[600],
                },
                "& span.kor": {
                  color: eng ? theme.palette.grey[600] : "white",
                },
              },
            },
          },
          "& > .actions": {
            display: "flex",
            gap: `${16 / 19.2}vw`, //  16,
            "& > button": {
              flex: 1,
              height: `${100 / 12}vh`, // 100,
              borderRadius: `${12 / 12}vh`, // 12,
              fontSize: `${32 / 12}vh`, //  32,
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
        <IconButton className="close" onClick={handleCancelClick}>
          <CloseThickIcon />
        </IconButton>
      </div>
      <div className="textField">
        {value ? (
          <Typography className="input" ref={inputRef}>
            {hangul.a(value)}
          </Typography>
        ) : (
          <Typography className="placeholder">{placeholder}</Typography>
        )}
      </div>
      <div className="keyboard">
        <div className="number">
          {Array.from("1234567890").map((s) => (
            <InputKey
              className="number"
              key={s}
              label={s}
              onClick={handleKeyClick(s)}
            />
          ))}
        </div>
        <div>
          {Array.from(
            eng ? (upper ? "QWERTYUIOP" : "qwertyuiop") : "ㅂㅈㄷㄱㅅㅗㅐㅔ"
          ).map((s) => (
            <InputKey key={s} label={s} onClick={handleKeyClick(s)} />
          ))}
        </div>
        <div>
          {Array.from(
            eng ? (upper ? "ASDFGHJKL" : "asdfghjkl") : "ㅁㄴㅇㄹㅎㅓㅏㅣ"
          ).map((s) => (
            <InputKey key={s} label={s} onClick={handleKeyClick(s)} />
          ))}
        </div>
        <div>
          <InputKey
            className="special"
            label={
              upper ? (
                <FormatLetterCaseUpperIcon
                  style={{ transform: "scale(1.2)" }}
                />
              ) : (
                <FormatLetterCaseLowerIcon
                  style={{ transform: "scale(1.2)" }}
                />
              )
            }
            disabled={!eng}
            style={{ opacity: eng ? 1 : 0 }}
            onClick={handleUpperClick}
          />
          {Array.from(
            eng ? (upper ? "ZXCVBNM" : "zxcvbnm") : "ㅋㅌㅊㅍㅜㅡ"
          ).map((s) => (
            <InputKey key={s} label={s} onClick={handleKeyClick(s)} />
          ))}
          <InputKey
            className="special"
            label={<BackspaceIcon />}
            disabled={!value}
            onClick={handleBackspaceClick}
          />
        </div>
        <div>
          <InputKey
            className="special"
            label={
              <>
                <span className="kor">한</span>
                <span>/</span>
                <span className="eng">영</span>
              </>
            }
            onClick={handleLangClick}
          />
          <InputKey className="space" label=" " onClick={handleKeyClick(" ")} />
          <InputKey
            className="special"
            label={confirmText}
            disabled={value.length < 1}
            onClick={handleConfirmClick}
          />
        </div>
      </div>
    </Dialog>
  );
};

export const InputKey = ({
  label,
  disabled,
  onClick: handleClick,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      disabled={disabled}
      onClick={handleClick}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: `${100 / 12}vh`, // 100,
        width: `${100 / 19.2}vw`, // 100,
        borderRadius: `${16 / 12}vh`, //  16,
        boxShadow: `0px 3px 8px #00000029`,
        background: theme.palette.grey[800],
        fontSize: `${48 / 12}vh`, // 48,
        fontWeight: 400,
        color: "#ffffff",
        "&:hover": {
          background: theme.palette.grey[800],
        },
        "&:disabled": {
          color: theme.palette.grey[600],
          background: theme.palette.grey[850],
        },
        "& svg": {
          width: `${48 / 19.2}vw`, //  48,
          height: `${48 / 12}vh`, // 48,
        },
      }}
      {...props}
    >
      {label}
    </Button>
  );
};
