import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";

import {
  headerLogoImg,
  mainBgImg,
  managerSecretRouteCode,
  mappingSecretRouteCode,
  secretRouteCodeLength,
} from "../constants";
import { HeaderBattery, HeaderLinkButton, HeaderSettingButton } from "./";
import { ServingIcon, CruisingIcon, MappingIcon, SensorIcon } from "./icons";
import { compareArray, playButtonClickSound } from "../utils";
import { HeaderSettingDialog } from "./HeaderSettingDialog";

export const Header = () => {
  const [buttonClickHistory, setButtonClickHistory] = useState([]);
  const [headerSettingDialogOpen, setHeaderSettingDialogOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleHeaderLinkButtonClick = (value) => () => {
    playButtonClickSound();
    if (buttonClickHistory.length < secretRouteCodeLength) {
      setButtonClickHistory([...buttonClickHistory, value]);
    } else {
      setButtonClickHistory([...buttonClickHistory.slice(1), value]);
    }
  };
  const headerSettingButtonClick = () => {
    playButtonClickSound();
    if (compareArray(buttonClickHistory, managerSecretRouteCode)) {
      setButtonClickHistory([]);
      navigate("managerSettings");
    } else if (compareArray(buttonClickHistory, mappingSecretRouteCode)) {
      setButtonClickHistory([]);
      navigate("mapping");
    } else {
      setHeaderSettingDialogOpen(true);
    }
  };
  const handleHeaderSettingDialogClose = () => {
    setHeaderSettingDialogOpen(false);
  };

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        height: theme.size.Header.height,
        margin: `${0 / 12}vh ${16 / 19.2}vw`, //`${0}px ${16}px`,
        padding: `${0 / 12}vh ${44 / 19.2}vw`, //`${0}px ${44}px`,
        background: `url(${mainBgImg})`,
        boxShadow: theme.shadows[3],
        "& > .headerLogo": {
          height: `${60 / 12}vh`, //  60,
        },
        "& > .linkButtonGroup": {
          display: "flex",
          gap: `${32 / 19.2}vw`, // 32,
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, 0)",
        },
      }}
    >
      <img className="headerLogo" src={headerLogoImg} alt="headerLogo" />
      <div className="linkButtonGroup">
        <HeaderLinkButton
          icon={<ServingIcon />}
          color="blue"
          children="통합 안전"
          to="serving"
          onClick={handleHeaderLinkButtonClick(0)}
        />
        <HeaderLinkButton
          icon={<SensorIcon />}
          color="green"
          children={`센서`}
          to="calling"
          onClick={handleHeaderLinkButtonClick(1)}
        />
        <HeaderLinkButton
          icon={<CruisingIcon />}
          color="yellow"
          children="크루즈"
          to="cruising"
          onClick={handleHeaderLinkButtonClick(2)}
        />
        <HeaderLinkButton
          icon={<MappingIcon />}
          color="purple"

          children="지도 작성"
          to="mapping"
          onClick={handleHeaderLinkButtonClick(3)}
        />
      </div>

      <HeaderSettingButton
        headerSettingDialogOpen={headerSettingDialogOpen}
        onClick={headerSettingButtonClick}
      />

      <HeaderBattery />

      <HeaderSettingDialog
        open={headerSettingDialogOpen}
        onClose={handleHeaderSettingDialogClose}
      />
    </Box>
  );
};
