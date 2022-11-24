import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, Box } from "@mui/material";

import { AlertDialog, Header } from "../components";
import { layoutBgImg, mainBgImg } from "../constants";
import { robotActions } from "../store";

export const Layout = () => {
  const [alertDialogProps, setAlertDialogProps] = useState({ open: false });
  const brightness = useSelector((state) => state.userSettings.brightness);
  const error = useSelector(
    (state) => state.robot.error,
    (prev, next) => prev?.type === next?.type && prev?.msg === next?.msg
  );
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      setAlertDialogProps({
        open: true,
        title: "시스템 메시지",
        content: error?.msg,
        type: error?.type,
        confirmButtonProps: {
          onClick: () => {
            handleAlertDialogClose();
            dispatch(robotActions.set({ error: null }));
          },
        },
      });
    } else {
      setAlertDialogProps({ open: false });
    }
  }, [dispatch, error]);

  const handleAlertDialogClose = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setAlertDialogProps((alertDialogProps) => ({
      ...alertDialogProps,
      open: false,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: `url(${layoutBgImg})`,
        backgroundSize: "100% 100%",
        filter: `brightness(${brightness})`,
        "& > main": {
          flex: 1,
          margin: `${28 / 12}vh ${60 / 19.2}vw`, // `${28}px ${60}px`,
          padding: `${28 / 12}vh ${28 / 19.2}vw`, // 28,
          height: `${100 / 12}vh`, //  100,
          borderRadius: `${20 / 12}vh`, // 20,
          boxShadow: theme.shadows[3],
          background: `url(${mainBgImg})`,
        },
      }}
    >
      <Header />
      <main>
        <Outlet />
      </main>

      <AlertDialog {...alertDialogProps} onClose={handleAlertDialogClose} />
    </Box>
  );
};
