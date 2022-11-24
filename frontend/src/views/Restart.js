import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme, Box, Typography } from "@mui/material";

import { headerLogoImg, progressBarBgImg, restartTimeout } from "../constants";
import { useInterval } from "../hooks";
import { systemActions } from "../store";

export const Restart = () => {
  const [progress, setProgress] = useState(0);
  const { restart, connectionLost } = useSelector((state) => state.system);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  useInterval(() => {
    if (progress === 100 && !restart) {
      dispatch(systemActions.change({ name: "restart", value: true }));
    } else {
      setProgress((p) => {
        if (p < 100) {
          return p + (1 / restartTimeout) * 100 * 100;
        } else {
          return 100;
        }
      });
    }
  }, 100);

  useEffect(() => {
    if (restart && !connectionLost) {
      dispatch(systemActions.change({ name: "restart", value: false }));
      navigate("/");
    }
  }, [dispatch, navigate, restart, connectionLost]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: theme.palette.grey[900],
        height: "100%",
        "& > .content": {
          fontSize: `${52 / 12}vh`, // 52,
          textAlign: "center",
          whiteSpace: "pre",
          marginBottom: `${48 / 12}vh`, //  48,
        },
        "& > .progress": {
          background: theme.palette.grey[950],
          width: `${800 / 19.2}vw`, //  800,
          height: `${40 / 12}vh`, //  40,
          borderRadius: `${20 / 12}vh`, // 20,
          overflow: "hidden",
          "& > div": {
            height: "100%",
            backgroundImage: `url(${progressBarBgImg})`,
            backgroundSize: "cover",
          },
        },
        "& > .logo": {
          position: "absolute",
          bottom: `${76 / 12}vh`, // 76,
          height: `${76 / 12}vh`, // 76,
        },
      }}
    >
      <Typography className="content">로봇을 다시 시작 중입니다.</Typography>
      <div className="progress">
        <div style={{ width: `${progress}%` }} />
      </div>
      <img className="logo" src={headerLogoImg} alt="servinggo" />
    </Box>
  );
};
