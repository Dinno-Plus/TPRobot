import { forwardRef, useState } from "react";
import {
  Button,
  Dialog,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slide,
  useTheme,
  Slider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  WhiteBalanceSunnyIcon,
  SpeedometerIcon,
  SpeedometerMediumIcon,
  SpeedometerSlowIcon,
  VolumeHighIcon,
  VolumeMediumIcon,
  VolumeLowIcon,
  VolumeVariantOffIcon,
  LightbulbOnIcon,
  SteeringIcon,
  PowerIcon,
  RestartIcon,
  ChevronRightIcon,
} from "./icons";
import { systemActions, userSettingsActions } from "../store";
import { playButtonClickSound } from "../utils";

const Transition = forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

export const HeaderSettingDialog = ({ onClose: handleClose, ...props }) => {
  const [sliderChanging, setSliderChanging] = useState(false);
  const userSettings = useSelector((state) => state.userSettings);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    if (["light", "avoid"].includes(event.target.name)) {
      playButtonClickSound();
      dispatch(
        userSettingsActions.set({
          ...userSettings,
          [event.target.name]: event.target.value,
        })
      );
    } else {
      if (!sliderChanging) playButtonClickSound();
      setSliderChanging(event.target.name);
      dispatch(userSettingsActions.change({ ...event.target }));
    }
  };
  const handleChangeCommitted = (event) => {
    setSliderChanging(false);
    dispatch(
      userSettingsActions.set({
        ...userSettings,
        [event.target.name]: event.target.value,
      })
    );
  };
  const handleShutdownClick = () => {
    playButtonClickSound();
    dispatch(systemActions.set("shutdown"));
    navigate("/shutdown");
  };
  const handleRestartClick = () => {
    playButtonClickSound();
    dispatch(systemActions.set("restart"));
    navigate("/restart");
  };
  const handleShowMoreSettingsClick = () => {
    playButtonClickSound();
    navigate("/userSettings");
    handleClose();
  };
  const handleBackdropClick = () => playButtonClickSound();

  const volumeIcon =
    userSettings.mute || userSettings.volume === 0 ? (
      <VolumeVariantOffIcon />
    ) : userSettings.volume > 0.6 ? (
      <VolumeHighIcon />
    ) : userSettings.volume > 0.3 ? (
      <VolumeMediumIcon />
    ) : (
      <VolumeLowIcon />
    );

  const speedIcon =
    userSettings.speed > 1 ? (
      <SpeedometerIcon />
    ) : userSettings.speed > 0.4 ? (
      <SpeedometerMediumIcon />
    ) : (
      <SpeedometerSlowIcon />
    );

  return (
    <Dialog
      onClose={handleClose}
      TransitionComponent={Transition}
      onBackdropClick={handleBackdropClick}
      BackdropProps={{
        sx: {
          background:
            sliderChanging !== "brightness" ? "#00000050" : "transparent",
        },
      }}
      PaperProps={{
        sx: {
          position: "absolute",
          top: theme.size.Header.height,
          right: `${60 / 19.2}vw`, //  60,
          padding: `${40 / 12}vh ${32 / 19.2}vw ${0 / 12}vh`, // `${40}px ${32}px ${0}px`,
          margin: 0,
          maxWidth: `${1920 / 19.2}vw`, //  1920,
          borderRadius: `${8 / 12}vh`, //  8,
          background:
            sliderChanging !== "brightness"
              ? theme.palette.grey[850]
              : "transparent",
          boxShadow:
            sliderChanging !== "brightness"
              ? theme.shadows[24]
              : theme.shadows[0],
          filter: `brightness(${userSettings.brightness})`,
          "& > .settings": {
            background: theme.palette.grey[800],
            padding: `${0 / 12}vh ${32 / 19.2}vw`, // `${0}px ${32}px`,
            boxShadow: theme.shadows[3],
            borderRadius:
              sliderChanging !== "brightness" ? `${8 / 12}vh` : `${56 / 12}vh`, //8 : 56,
            "& > hr": { background: theme.palette.grey[700] },
            "& > div": {
              display: "flex",
              alignItems: "center",
              height: `${112 / 12}vh`, //  112,
              "& > svg": {
                width: `${44 / 19.2}vw`, //  44,
                height: `${44 / 12}vh`, //  44,
                marginRight: `${20 / 19.2}vw`, // 20,
              },
              "& > h2": {
                width: `${128 / 19.2}vw`, //  128,
                fontSize: `${32 / 12}vh`, // 32,
                fontWeight: 400,
                marginRight: `${40 / 19.2}vw`, // 40,
              },
              "& > .slider": {
                width: `${660 / 19.2}vw`, //  660,
                margin: `${0 / 12}vh ${20 / 19.2}vw`, //`${0}px ${20}px`,
              },
              "& > .radioGroup": {
                flex: 1,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                "& svg": {
                  width: `${44 / 19.2}vw`, //  44,
                  height: `${44 / 12}vh`, //  44,
                },
                "& > label": {
                  fontSize: `${28 / 12}vh`, //  28,
                },
              },
              "& > .buttonGroup": {
                flex: 1,
                display: "flex",
                gap: `${36 / 19.2}vw`, //  36,
                "& > button": {
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: `${28 / 12}vh`, // 28,
                  fontWeight: 400,
                  border: `${3 / 12}vh solid ${theme.palette.primary.main}`, //3
                  borderRadius: `${44 / 12}vh`, //  44,
                  padding: `${0 / 12}vh ${40 / 19.2}vw`, //`${0}px ${40}px`,
                  height: `${80 / 12}vh`, // 80,
                  background: theme.palette.grey[850],
                  "& > svg": {
                    width: `${40 / 19.2}vw`, //  40,
                    height: `${40 / 12}vh`, //  40,
                  },
                },
              },
            },
          },
          "& > .showMoreSettings": {
            fontSize: `${32 / 12}vh`, // 32,
            padding: `${20 / 12}vh ${0 / 19.2}vw`, //`${20}px ${0}px`,
            margin: `${16 / 12}vh ${0 / 19.2}vw`, //`${16}px ${0}px`,
            borderRadius: `${48 / 12}vh`, //  48,
            "& > svg": {
              width: `${48 / 19.2}vw`, //  48,
              height: `${48 / 12}vh`, //  48,
              marginLeft: `${8 / 19.2}vw`, //  8,
            },
          },
        },
      }}
      {...props}
    >
      <div className="settings">
        <div>
          <WhiteBalanceSunnyIcon />
          <h2>화면 밝기</h2>
          <Slider
            className="slider"
            name="brightness"
            value={userSettings.brightness}
            min={0.5}
            max={1}
            step={0.005}
            onChange={handleChange}
            onChangeCommitted={handleChangeCommitted}
          />
        </div>
        {sliderChanging !== "brightness" && (
          <>
            <Divider />

            <div>
              {volumeIcon}
              <h2>알림 음량</h2>
              <Slider
                className="slider"
                name="volume"
                value={userSettings.volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleChange}
                onChangeCommitted={handleChangeCommitted}
              />
            </div>
            <Divider />

            <div>
              {speedIcon}
              <h2>주행 속도</h2>
              <Slider
                className="slider"
                name="speed"
                value={userSettings.speed}
                min={0.1}
                max={1.5}
                step={0.1}
                onChange={handleChange}
                onChangeCommitted={handleChangeCommitted}
              />
            </div>
            <Divider />

            <div>
              <LightbulbOnIcon />
              <h2>불빛 알림</h2>
              <RadioGroup
                className="radioGroup"
                name="light"
                value={userSettings.light}
                onChange={handleChange}
              >
                <FormControlLabel value="on" control={<Radio />} label="켜기" />
                <FormControlLabel
                  value="off"
                  control={<Radio />}
                  label="끄기"
                />
              </RadioGroup>
            </div>
            <Divider />

            <div>
              <SteeringIcon />
              <h2>회피 주행</h2>
              <RadioGroup
                className="radioGroup"
                name="avoid"
                value={userSettings.avoid}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="avoid1"
                  control={<Radio />}
                  label="스탑&고"
                />
                <FormControlLabel
                  value="avoid2"
                  control={<Radio />}
                  label="회피1"
                />
                <FormControlLabel
                  value="avoid3"
                  control={<Radio />}
                  label="회피2"
                />
              </RadioGroup>
            </div>
            <Divider />

            <div>
              <PowerIcon />
              <h2>로봇 전원</h2>
              <div className="buttonGroup">
                <Button onClick={handleShutdownClick}>
                  종료
                  <PowerIcon />
                </Button>
                <Button onClick={handleRestartClick}>
                  다시시작
                  <RestartIcon />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      {sliderChanging !== "brightness" && (
        <Button
          className="showMoreSettings"
          onClick={handleShowMoreSettingsClick}
        >
          설정 더보기
          <ChevronRightIcon />
        </Button>
      )}
    </Dialog>
  );
};
