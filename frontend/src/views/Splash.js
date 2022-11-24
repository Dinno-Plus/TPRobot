import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import { splashBgImg, splashTimeout } from "../constants";

export const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const splashTimeoutTimer = setTimeout(() => {
      navigate("/serving");
    }, splashTimeout);
    return () => {
      clearTimeout(splashTimeoutTimer);
    };
  }, [navigate]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${splashBgImg}) `,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    ></Box>
  );
};
