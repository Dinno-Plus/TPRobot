import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme, Box, Typography } from "@mui/material";

import { headerLogoImg, progressBarBgImg, shutdownTimeout } from "../constants";
import { useInterval } from "../hooks";
import { systemActions } from "../store";

export const Shutdown = () => {
  const [progress, setProgress] = useState(0);
  const { shutdown, connectionLost } = useSelector((state) => state.system);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  useInterval(() => {
    if (progress === 100 && !shutdown) {
      dispatch(systemActions.change({ name: "shutdown", value: true }));
    } else {
      setProgress((p) => {
        if (p < 100) {
          return p + (1 / shutdownTimeout) * 100 * 100;
        } else {
          return 100;
        }
      });
    }
  }, 100);

  useEffect(() => {
    if (shutdown && !connectionLost) {
      dispatch(systemActions.change({ name: "shutdown", value: false }));
      navigate("/");
    }
  }, [dispatch, navigate, shutdown, connectionLost]);

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
          marginBottom: `${(progress < 100 ? 48 : 0) / 12}vh`, // progress < 100 ? 48 : 0,
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
      <Typography className="content">
        {progress < 100
          ? "로봇을 종료 중입니다."
          : "로봇이 종료되었습니다.\n인더스웰를 이용하시려면 전원을 켜주세요."}
      </Typography>
      {progress < 100 && (
        <div className="progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      )}
      <img className="logo" src={headerLogoImg} alt="induswell" />
    </Box>
  );
};
