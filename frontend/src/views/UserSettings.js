import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Typography,
  useTheme,
} from "@mui/material";

import { AlertDialog, NumberInputDialog } from "../components";
import {
  VolumeVariantOffIcon,
  VolumeHighIcon,
  VolumeMediumIcon,
  VolumeLowIcon,
  SpeedometerIcon,
  SpeedometerMediumIcon,
  SpeedometerSlowIcon,
  ContentSaveIcon,
  FolderOpenIcon,
  PowerIcon,
  RestartIcon,
  CheckCircleIcon,
  WhiteBalanceSunnyIcon,
  LockIcon,
} from "../components/icons";
import { playButtonClickSound } from "../utils";
import { systemActions, userSettingsActions } from "../store";

export const UserSettings = () => {
  const [sliderChanging, setSliderChanging] = useState(false);
  const [numberInputDialogProps, setNumberInputDialogProps] = useState({
    open: false,
  });
  const [alertDialogProps, setAlertDialogProps] = useState({ open: false });
  const userSettings = useSelector((state) => state.userSettings);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSaveClick = () => {
    playButtonClickSound();
    dispatch(systemActions.set("saveUserSettings"));
  };
  const handleLoadClick = () => {
    playButtonClickSound();
    dispatch(systemActions.set("loadUserSettings"));
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

  const handleChange = (event) => {
    if (
      ["voice", "alert", "music", "light", "avoid"].includes(event.target.name)
    ) {
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
  const handleMappingPasswordChangeClick = () => {
    playButtonClickSound();
    setNumberInputDialogProps({
      open: true,
      title: "지도 작성 비밀번호 변경",
      subTitle: "Step 1",
      placeholder: "현재 비밀번호를 입력해 주세요.",
      action: (oldPassword) => handleOldPasswordInput(oldPassword),
    });
  };
  const handleOldPasswordInput = (oldPassword) => {
    if (oldPassword === userSettings.mappingPassword) {
      setNumberInputDialogProps({
        open: true,
        title: "지도 작성 비밀번호 변경",
        subTitle: "Step 2",
        placeholder: "새 비밀번호를 입력해 주세요.",
        action: (newPassword1) => handleNewPasswordInput(newPassword1),
      });
    } else {
      setNumberInputDialogProps({
        open: true,
        title: "지도 작성 비밀번호 변경",
        subTitle: "Step 1",
        placeholder:
          "비밀번호를 잘못 입력하였습니다.\n현재 비밀번호를 다시 입력해 주세요.",
        action: (oldPassword) => handleOldPasswordInput(oldPassword),
      });
    }
  };
  const handleNewPasswordInput = (newPassword1) => {
    setNumberInputDialogProps({
      open: true,
      title: "지도 작성 비밀번호 변경",
      subTitle: "Step 3",
      placeholder: "새 비밀번호를 한 번 더 입력해 주세요.",
      action: (newPassword2) =>
        handleNewPasswordConfirmInput(newPassword1, newPassword2),
    });
  };
  const handleNewPasswordConfirmInput = (newPassword1, newPassword2) => {
    if (newPassword1 === newPassword2) {
      dispatch(
        userSettingsActions.set({
          ...userSettings,
          mappingPassword: newPassword1,
        })
      );
      setNumberInputDialogProps({ open: false });
      setAlertDialogProps({
        open: true,
        title: "지도 작성 비밀번호 변경",
        content: "지도 작성 비밀번호가 변경되었습니다.",
        type: "information",
        confirmButtonProps: {
          onClick: () => {
            handleAlertDialogClose();
            playButtonClickSound();
          },
        },
      });
    } else {
      setNumberInputDialogProps({
        open: true,
        title: "지도 작성 비밀번호 변경",
        subTitle: "Step 3",
        placeholder:
          "새 비밀번호가 일치하지 않습니다.\n확인하신 후 다시 입력해 주세요.",
        action: (newPassword2) =>
          handleNewPasswordConfirmInput(newPassword1, newPassword2),
      });
    }
  };

  const handleNumberInputDialogClose = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setNumberInputDialogProps((numberInputDialogProps) => ({
      ...numberInputDialogProps,
      open: false,
    }));
  };
  const handleAlertDialogClose = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setAlertDialogProps((alertDialogProps) => ({
      ...alertDialogProps,
      open: false,
    }));
  };

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        "& h1": {
          fontSize: `${40 / 12}vh`, // 40,
          fontWeight: 700,
        },
        "& h2": {
          fontSize: `${28 / 12}vh`, // 28,
          fontWeight: 500,
        },
        "& h3": {
          fontSize: `${28 / 12}vh`, // 28,
          fontWeight: 400,
        },
        "& > .header": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: `${0}vh ${20 / 19.2}vw`, // `${0}px ${20}px`,
          "& > .buttonGroup": {
            display: "flex",
            gap: `${20 / 19.2}vw`, // 20,
            "& > button": {
              display: "flex",
              justifyContent: "space-between",
              width: `${264 / 19.2}vw`, // 264,
              fontSize: `${32 / 12}vh`, // 32,
              fontWeight: 700,
              padding: `${20 / 12}vh ${28 / 19.2}vw`, //`${20}px ${28}px`,
              background: theme.palette.grey[850],
              boxShadow: theme.shadows[3],
              border: `${3 / 12}vh solid ${theme.palette.secondary.main}`, // `${3}px solid ${theme.palette.secondary.main}`,
              borderRadius: `${24 / 12}vh`, // 24,
              "& > svg": {
                width: `${48 / 19.2}vw`, // 48,
                height: `${48 / 12}vh`, //  48,
              },
            },
          },
        },
        "& > .content": {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          margin: `${24 / 12}vh ${20 / 19.2}vw`, //`${24}px ${20}px`,
          padding: `${0 / 12}vh ${28 / 19.2}vw`, //`${0}px ${28}px`,
          backgroundColor: theme.palette.grey[900],
          border: `${2 / 12}vh solid ${theme.palette.grey[800]}`, //`${2}px solid ${theme.palette.grey[800]}`,
          borderRadius: `${16 / 12}vh`, //  16,
          "& hr": { backgroundColor: theme.palette.grey[800] },
          "& > .title": {
            display: "flex",
            alignItems: "center",
            height: `${96 / 12}vh`, // 96,
            "& > svg:nth-of-type(1)": {
              width: `${44 / 19.2}vw`, // 44,
              height: `${44 / 12}vh`, //  44,
              marginRight: `${16 / 19.2}vw`, //  16,
            },
            "& > h2": {
              width: `${244 / 19.2}vw`, // 244,
            },
            "& > svg:nth-of-type(2)": {
              width: `${44 / 19.2}vw`, // 44,
              height: `${44 / 12}vh`, //  44,
              marginRight: `${32 / 19.2}vw`, //  32,
            },
            "& > .slider": {
              width: `${980 / 19.2}vw`, // 980,
              marginRight: `${32 / 19.2}vw`, // 32,
            },
            "& > .button": {
              padding: 0,
              width: `${240 / 19.2}vw`, // 240,
              height: `${68 / 12}vh`, //  68,
              fontSize: `${28 / 12}vh`, //  28,
              fontWeight: 400,
              background: theme.palette.grey[850],
              border: `${2 / 12}vh solid ${theme.palette.secondary.main}`, //`${2}px solid ${theme.palette.secondary.main}`,
              borderRadius: `${12 / 12}vh`, // 12,
              "& svg": {
                width: `${32 / 19.2}vw`, // 32,
                height: `${32 / 12}vh`, //  32,
                marginLeft: `${8 / 19.2}vw`, //  8,
              },
            },
          },
          "& > .subSettings": {
            marginBottom: `${12 / 12}vh`, // 12,
            "& > .subSetting": {
              display: "flex",
              alignItems: "center",
              height: `${80 / 12}vh`, //  80,
              marginLeft: `${80 / 19.2}vw`, // 80,
              "& > h3": {
                width: `${228 / 19.2}vw`, // 228,
              },
            },
          },
          "& .radioGroup": {
            flex: 1,
            display: "flex",
            flexDirection: "row",
            fontSize: `${28 / 12}vh`, // 28,
            "& svg": {
              width: `${40 / 19.2}vw`, // 40,
              height: `${40 / 12}vh`, //  40,
            },
            "& > label": {
              marginRight: 0,
              width: `${280 / 19.2}vw`, // 280,
            },
          },
        },
      }}
    >
      <div className="header">
        <Typography variant="h1">사용자 설정</Typography>
        <div className="buttonGroup">
          <Button onClick={handleSaveClick}>
            <span>저장하기</span>
            <ContentSaveIcon />
          </Button>
          <Button onClick={handleLoadClick}>
            <span>불러오기</span>
            <FolderOpenIcon />
          </Button>
          <Button onClick={handleShutdownClick}>
            <span>종료</span>
            <PowerIcon />
          </Button>
          <Button onClick={handleRestartClick}>
            <span>다시시작</span>
            <RestartIcon />
          </Button>
        </div>
      </div>

      <div className="content">
        <div className="title">
          <CheckCircleIcon />
          <Typography variant="h2">화면 밝기</Typography>
          <WhiteBalanceSunnyIcon />
          <Slider
            className="slider"
            name="brightness"
            value={userSettings.brightness}
            onChange={handleChange}
            onChangeCommitted={handleChangeCommitted}
            min={0.5}
            max={1}
            step={0.005}
          />
        </div>
        <Divider />

        <div className="title">
          <CheckCircleIcon />
          <Typography variant="h2">소리 알림</Typography>
          {volumeIcon}
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
        <div className="subSettings">
          <div className="subSetting">
            <Typography variant="h3">음성 안내</Typography>
            <RadioGroup
              className="radioGroup"
              name="voice"
              value={userSettings.voice}
              onChange={handleChange}
            >
              <FormControlLabel
                value="baseFemale"
                control={<Radio />}
                label="기본 - 여성"
              />
              <FormControlLabel
                value="baseMale"
                control={<Radio />}
                label="기본 - 남성"
              />
              <FormControlLabel
                value="child"
                control={<Radio />}
                label="어린이"
              />
              <FormControlLabel
                value="user"
                control={<Radio />}
                label="사용자"
              />
            </RadioGroup>
          </div>
          <div className="subSetting">
            <Typography variant="h3">경고음</Typography>
            <RadioGroup
              className="radioGroup"
              name="alert"
              value={userSettings.alert}
              onChange={handleChange}
            >
              <FormControlLabel
                value="alert1"
                control={<Radio />}
                label="경고음 - 1"
              />
              <FormControlLabel
                value="alert2"
                control={<Radio />}
                label="경고음 - 2"
              />
              <FormControlLabel
                value="alert3"
                control={<Radio />}
                label="경고음 - 3"
              />
            </RadioGroup>
          </div>
          <div className="subSetting">
            <Typography variant="h3">음악</Typography>
            <RadioGroup
              className="radioGroup"
              name="music"
              value={userSettings.music}
              onChange={handleChange}
            >
              <FormControlLabel
                value="music1"
                control={<Radio />}
                label="음악 - 1"
              />
              <FormControlLabel
                value="music2"
                control={<Radio />}
                label="음악 - 2"
              />
              <FormControlLabel
                value="music3"
                control={<Radio />}
                label="음악 - 3"
              />
            </RadioGroup>
          </div>
        </div>
        <Divider />

        <div className="title">
          <CheckCircleIcon />
          <Typography variant="h2">주행 속도</Typography>
          {speedIcon}
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
          <h3>{userSettings.speed} (m/s)</h3>
        </div>
        <Divider />

        <div className="title">
          <CheckCircleIcon />
          <Typography variant="h2">불빛 알림</Typography>
          <RadioGroup
            className="radioGroup"
            name="light"
            value={userSettings.light}
            onChange={handleChange}
          >
            <FormControlLabel value="on" control={<Radio />} label="켜기" />
            <FormControlLabel value="off" control={<Radio />} label="끄기" />
          </RadioGroup>
        </div>
        <Divider />

        <div className="title">
          <CheckCircleIcon />
          <Typography variant="h2">회피 주행</Typography>
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

        <div className="title">
          <CheckCircleIcon />
          <Typography variant="h2">지도 작성</Typography>
          <Button className="button" onClick={handleMappingPasswordChangeClick}>
            비밀번호 변경
            <LockIcon />
          </Button>
        </div>
      </div>
      <NumberInputDialog
        {...numberInputDialogProps}
        onClose={handleNumberInputDialogClose}
      />
      <AlertDialog {...alertDialogProps} onClose={handleAlertDialogClose} />
    </Box>
  );
};
