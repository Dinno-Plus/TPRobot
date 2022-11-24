import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useTheme,
  Box,
  Button,
  Divider,
  Popover,
  Typography,
} from "@mui/material";

import {
  AlertDialog,
  NumberInputDialog,
  BottomButton,
  DestinationGrid,
  TextInputDialog,
} from "../components";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon,
  PlayIcon,
  ContentSaveIcon,
  ReloadIcon,
  StopIcon,
  MenuUpIcon,
  TrashCanOutlineIcon,
  MenuDownIcon,
  RadioBoxMarkedIcon,
  RadioBoxBlankIcon,
  MappingIcon,
  HomeIcon,
  BatteryCharging60Icon,
  PencilIcon,
} from "../components/icons";
import { sleep, playButtonClickSound, capitalize } from "../utils";
import {
  getMapsInterval,
  m2tMapModeChangeTimeout,
  t2mMapModeChangeTimeout,
} from "../constants";
import { TwoPanelLayout } from "../layouts";
import { useInterval } from "../hooks";
import { mapsActions } from "../store";
import { useNavigate } from "react-router-dom";

export const Mapping = () => {
  const [isAuthorized, setIsAuthorized] = useState(false); // true, false
  const [selectedMapName, setSelectedMapName] = useState("");
  const [destinationsPlus, setDestinationsPlus] = useState([]);
  const [numberInputDialogProps, setNumberInputDialogProps] = useState({
    open: true,
    title: "지도 작성 비밀번호 입력",
    placeholder: "지도 작성 비밀번호를 입력해 주세요.",
    action: (oldPassword) => handlePasswordInput(oldPassword),
  });
  const [textInputDialogProps, setTextInputDialogProps] = useState({
    open: false,
    title: "새 목적지 추가",
    placeholder: "추가하려는 목적지의 이름을 입력해 주세요.",
    action: () => {},
  });
  const [alertDialogProps, setAlertDialogProps] = useState({ open: false });
  const { img: mapImg, mode, maps } = useSelector((state) => state.maps);
  const { mappingPassword } = useSelector((state) => state.userSettings);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useInterval(() => {
    dispatch(mapsActions.getMapImg());
  }, getMapsInterval);

  useLayoutEffect(() => {
    dispatch(mapsActions.get());
  }, [dispatch]);
  useLayoutEffect(() => {
    const { name, destinations } = maps.find((map) => map.selected);
    setSelectedMapName(name);
    setDestinationsPlus(
      destinations.map((d) => ({
        ...d,
        selected: false,
        order: [],
      }))
    );
  }, [maps]);

  const handlePasswordInput = (password) => {
    if (password === mappingPassword) {
      setIsAuthorized(true);
      setNumberInputDialogProps((numberInputDialogProps) => ({
        ...numberInputDialogProps,
        open: false,
      }));
    } else {
      setNumberInputDialogProps({
        open: true,
        title: "지도 작성 비밀번호 입력",
        placeholder: "비밀번호를 잘못 입력하였습니다.\n다시 입력해 주세요.",
        action: (oldPassword) => handlePasswordInput(oldPassword),
      });
    }
  };
  const handleLeftPanelButtonClick = async (event) => {
    playButtonClickSound();
    const value = event.currentTarget.name;
    if (value !== "mode") {
      dispatch(mapsActions.set({ value }));
    } else {
      let newMode, timeout;
      if (mode === "Metric") {
        newMode = "Topologic";
        timeout = m2tMapModeChangeTimeout;
      } else {
        newMode = "Metric";
        timeout = t2mMapModeChangeTimeout;
      }

      dispatch(mapsActions.set({ value, mode: newMode }));
      for (let i = 0; i < timeout / 100; i++) {
        setAlertDialogProps({
          open: true,
          title: "지도 모드 변경",
          content: "지도 모드를 변경 중입니다.",
          type: "information",
          progress: (i / timeout) * 100 * 100,
          confirmButtonProps: { disabled: true },
        });
        await sleep(100);
      }
      setAlertDialogProps({
        open: true,
        title: "지도 모드 변경",
        content: "지도 모드가 변경되었습니다.",
        type: "information",
        progress: 100,
        confirmButtonProps: {
          disabled: false,
          onClick: handleAlertDialogClose,
        },
      });
    }
  };
  const handleMapChange = (name) => {
    dispatch(mapsActions.set({ value: "load", name }));
    dispatch(mapsActions.get());
  };
  const handleDestinationsChange = useCallback(
    (destinations) => {
      dispatch(
        mapsActions.set({
          value: "change",
          destinations: destinations.map(({ name, type }) => ({ name, type })),
        })
      );
    },
    [dispatch]
  );
  const handleDestinationAdd = useCallback(
    (type) => {
      playButtonClickSound();
      setTextInputDialogProps({
        open: true,
        title: "새 목적지 추가",
        placeholder: "추가하려는 목적지의 이름을 입력해 주세요.",
        action: (name) => {
          // unique 목적지 이름 체크 및 경고
          if (destinationsPlus.map((d) => d.name).includes(name)) {
            setTextInputDialogProps((props) => ({
              ...props,
              placeholder:
                "이미 존재하는 목적지 이름입니다. 다시 입력해 주세요.",
            }));
          } else {
            handleDestinationsChange([...destinationsPlus, { name, type }]);
            handleTextInputDialogClose();
          }
        },
      });
    },
    [handleDestinationsChange, destinationsPlus]
  );
  const handleDestinationClick = useCallback((selected) => {
    playButtonClickSound();
    setDestinationsPlus((ds) =>
      ds.map((d) =>
        d.name === selected.name
          ? { ...d, selected: !d.selected }
          : { ...d, selected: false }
      )
    );
  }, []);
  const handleDestinationEdit = () => {
    playButtonClickSound();
    const curName = destinationsPlus.find((d) => d.selected).name;
    setTextInputDialogProps({
      open: true,
      title: "기존 목적지 이름 수정",
      placeholder: "선택한 목적지의 새 이름을 입력해 주세요.",
      initValue: curName,
      confirmText: "수정",
      action: (name) => {
        // unique 목적지 이름 체크 및 경고
        if (
          curName !== name &&
          destinationsPlus.map((d) => d.name).includes(name)
        ) {
          setTextInputDialogProps((props) => ({
            ...props,
            placeholder: "이미 존재하는 목적지 이름입니다. 다시 입력해 주세요.",
          }));
        } else {
          handleDestinationsChange(
            destinationsPlus.map((d) => (d.selected ? { ...d, name } : d))
          );
          handleTextInputDialogClose();
        }
      },
    });
  };
  const handleDestinationDelete = () => {
    playButtonClickSound();
    handleDestinationsChange(destinationsPlus.filter((d) => !d.selected));
  };

  const memorizedDestinationGrid = useMemo(
    () => (
      <DestinationGrid
        color="purple"
        mapName={selectedMapName}
        badge="type"
        destinations={destinationsPlus}
        onClick={handleDestinationClick}
        onChange={handleDestinationsChange}
        onAdd={handleDestinationAdd}
      />
    ),
    [
      destinationsPlus,
      selectedMapName,
      handleDestinationClick,
      handleDestinationsChange,
      handleDestinationAdd,
    ]
  );

  const handleNumberInputDialogClose = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setNumberInputDialogProps((numberInputDialogProps) => ({
      ...numberInputDialogProps,
      open: false,
    }));
    if (!isAuthorized) navigate(-1);
  };
  const handleTextInputDialogClose = (e, reason) => {
    playButtonClickSound();
    if (reason && reason === "backdropClick") return;
    setTextInputDialogProps((textInputDialogProps) => ({
      ...textInputDialogProps,
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

  return (
    <>
      <TwoPanelLayout
        leftPanel={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: `${28 / 12}vh ${28 / 19.2}vw`, //28,
              "& > .topButtonGroup": {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: `${32 / 12}vh`, // 32,
              },
              "& > .mapWrapper": {
                flex: 1,
                display: "flex",
                borderRadius: `${20 / 12}vh`, // 20,
                overflow: "hidden",
                "&.disabled": { filter: "brightness(65%)" },
                "& button": {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.grey[900],
                  width: `${76 / 12}vh`, //  76,
                  height: `${76 / 19.2}vw`, // 76,
                  borderRadius: "50%",
                  "& svg": {
                    width: `${48 / 12}vh`, //  48,
                    height: `${48 / 19.2}vw`, // 48,
                  },
                },
                "& > .map": {
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  background: "#47615e",
                  boxShadow: `inset 0 0 ${20 / 12}vh rgba(0,0,0,0.3)`, // `inset 0 0 ${20}px rgba(0,0,0,0.3)`,
                  "& > img": {
                    marginTop: `${64 / 12}vh`, //  64,
                    width: `${442 / 19.2}vw`, // 442,
                  },
                  "& > .arrowButtonGroup": {
                    position: "absolute",
                    bottom: `${64 / 12}vh`, // 64,
                    display: "flex",
                    justifyContent: "center",
                    gap: `${28 / 19.2}vw`, // 28,
                    width: "100%",
                  },
                },
                "& > .zoomButtonGroup": {
                  display: "flex",
                  flexDirection: "column",
                  width: `${160 / 19.2}vw`, // 160,
                  "& > hr": { background: theme.palette.grey[700] },
                  "& > .zoomButtonWrapper": {
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: theme.palette.grey[850],
                  },
                },
              },
            }}
          >
            <div className="topButtonGroup">
              {[
                {
                  icon: mode.charAt(0),
                  name: "mode",
                  label: mode === "Metric" ? "메트릭" : "토폴로지",
                },
                { icon: <PlayIcon />, name: "start", label: "시작" },
                { icon: <StopIcon />, name: "stop", label: "정지" },
                { icon: <ReloadIcon />, name: "reset", label: "초기화" },
                { icon: <ContentSaveIcon />, name: "save", label: "저장" },
              ].map((props, key) => (
                <TopButton
                  key={key}
                  disabled={!isAuthorized}
                  onClick={handleLeftPanelButtonClick}
                  {...props}
                />
              ))}
            </div>
            <div className={`mapWrapper ${!isAuthorized && "disabled"}`}>
              <div className="map">
                {mapImg && (
                  <img src={`data:image/jpeg;base64,${mapImg}`} alt="map" />
                )}
                <div className="arrowButtonGroup">
                  {[
                    { name: "left", icon: <ArrowLeftIcon /> },
                    { name: "up", icon: <ArrowUpIcon /> },
                    { name: "down", icon: <ArrowDownIcon /> },
                    { name: "right", icon: <ArrowRightIcon /> },
                  ].map((props, key) => (
                    <RoundIconButton
                      key={key}
                      disabled={!isAuthorized}
                      onClick={handleLeftPanelButtonClick}
                      {...props}
                    />
                  ))}
                </div>
              </div>
              <div className="zoomButtonGroup">
                <div className="zoomButtonWrapper">
                  <RoundIconButton
                    disabled={!isAuthorized}
                    onClick={handleLeftPanelButtonClick}
                    name="zoomIn"
                    icon={<PlusIcon />}
                  />
                </div>
                <Divider />
                <div className="zoomButtonWrapper">
                  <RoundIconButton
                    disabled={!isAuthorized}
                    onClick={handleLeftPanelButtonClick}
                    name="zoomOut"
                    icon={<MinusIcon />}
                  />
                </div>
              </div>
            </div>
          </Box>
        }
        rightPanel={
          <>
            <SelectMiniPaper maps={maps} onChange={handleMapChange} />

            {memorizedDestinationGrid}

            <Box
              sx={{
                display: "flex",
                gap: `${28 / 12}vh`, //  28,
                "& > button": { flex: 1 },
              }}
            >
              {destinationsPlus.some((d) => d.selected) ? (
                <>
                  <BottomButton
                    label="목적지 수정"
                    labelAlign="left"
                    color="purple"
                    icon={<PencilIcon />}
                    disabled={!isAuthorized}
                    onClick={handleDestinationEdit}
                  />
                  <BottomButton
                    label="목적지 삭제"
                    labelAlign="left"
                    color="whitePurple"
                    icon={<TrashCanOutlineIcon />}
                    disabled={!isAuthorized}
                    onClick={handleDestinationDelete}
                  />
                </>
              ) : (
                <>
                  <BottomButton
                    label="홈 추가"
                    labelAlign="left"
                    color="purple"
                    icon={<HomeIcon />}
                    disabled={!isAuthorized}
                    onClick={() => handleDestinationAdd("home")}
                  />
                  <BottomButton
                    label="충전 추가"
                    labelAlign="left"
                    color="whitePurple"
                    icon={<BatteryCharging60Icon />}
                    disabled={!isAuthorized}
                    onClick={() => handleDestinationAdd("charge")}
                  />
                </>
              )}
            </Box>
          </>
        }
      />
      <NumberInputDialog
        {...numberInputDialogProps}
        onClose={handleNumberInputDialogClose}
      />
      <TextInputDialog
        {...textInputDialogProps}
        onClose={handleTextInputDialogClose}
      />
      <AlertDialog {...alertDialogProps} onClose={handleAlertDialogClose} />
    </>
  );
};

const TopButton = ({ icon, label, ...props }) => {
  const theme = useTheme();
  return (
    <Button
      sx={{
        justifyContent: "space-between",
        padding: `${12 / 12}vh ${12 / 19.2}vw`, //12,
        background: theme.palette.grey[800],
        fontSize: `${26 / 12}vh`, //  26,
        width: `${148 / 19.2}vw`, //  148,
        height: `${76 / 12}vh`, // 76,
        borderRadius: `${16 / 12}vh`, // 16,
        "& svg": {
          width: `${32 / 19.2}vw`, //  32,
          height: `${32 / 12}vh`, //  32
        },
        "& > .label": { flex: 1 },
        "&.Mui-disabled": { color: theme.palette.grey[600] },
        "&:hover": { background: theme.palette.grey[800] },
      }}
      {...props}
    >
      {icon}
      <span className="label">{label}</span>
    </Button>
  );
};

const RoundIconButton = ({ icon, ...props }) => {
  const theme = useTheme();
  return (
    <Button
      sx={{
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.grey[900],
        width: `${76 / 19.2}vw`, // 76,
        height: `${76 / 12}vh`, //  76,
        borderRadius: "50%",
        padding: 0,
        "& svg": {
          width: `${48 / 19.2}vw`, //  48,
          height: `${48 / 12}vh`, //  48
        },
      }}
      {...props}
    >
      {icon}
    </Button>
  );
};

const SelectMiniPaper = ({ maps, onChange: handleChange }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const selectedMapName = useMemo(
    () => maps.find((map) => map.selected).name,
    [maps]
  );

  const handleClick = (event) => {
    playButtonClickSound();
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    playButtonClickSound();
    setOpen(false);
  };
  const handleMenuItemClick = (event) => {
    playButtonClickSound();
    handleChange(event.currentTarget.value);
    setOpen(false);
  };

  return (
    <>
      <MenuItemMiniPaper
        color="purple"
        startIcon={<MappingIcon />}
        endIcon={
          <Box
            sx={{
              background: theme.palette.grey[400],
              borderRadius: `${8 / 12}vh`, //  8,
              width: `${52 / 19.2}vw`, //  52,
              height: `${52 / 12}vh`, //  52
            }}
          >
            {open ? <MenuUpIcon /> : <MenuDownIcon />}
          </Box>
        }
        content={selectedMapName}
        onClick={handleClick}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disablePortal
        keepMounted
        PaperProps={{
          sx: {
            display: "flex",
            flexDirection: "column",
            width: anchorEl?.offsetWidth,
            marginTop: `${16 / 12}vh`, //  16,
            borderRadius: `${16 / 12}vh`, // 16,
            maxHeight: anchorEl?.offsetHeight * 4.2,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {maps.map((map, idx) => (
          <MenuItemMiniPaper
            key={map.name}
            color="purple"
            startIcon={<MappingIcon />}
            endIcon={
              map.selected ? (
                <RadioBoxMarkedIcon
                  style={{ color: theme.palette.primary.main }}
                />
              ) : (
                <RadioBoxBlankIcon style={{ color: theme.palette.grey[600] }} />
              )
            }
            content={map.name}
            onClick={handleMenuItemClick}
            borderBottom={idx < maps.length - 1}
          />
        ))}
      </Popover>
    </>
  );
};

const MenuItemMiniPaper = ({
  color,
  startIcon,
  endIcon,
  content,
  borderBottom,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      value={content}
      {...props}
      sx={{
        display: "flex",
        gap: `${28 / 19.2}vw`, //  28,
        height: `${164 / 12}vh`, //  164,
        background: "#ffffff",
        borderRadius: `${16 / 12}vh`, //  16,
        color: theme.palette.text.secondary,
        padding: `${28 / 12}vh ${28 / 19.2}vw`, //28,
        position: "relative",
        "&:hover": { background: "#ffffff" },
        "&:after": {
          position: "absolute",
          bottom: 0,
          width: "100%",
          content: "''",
          borderBottom: borderBottom
            ? `${1 / 12}vh solid ${theme.palette.grey[400]}` // `${1}px solid ${theme.palette.grey[400]}`
            : "none",
        },
        "& > .startIconWrapper": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: `${116 / 19.2}vw`, //  116,
          height: `${116 / 12}vh`, //  116
          borderRadius: `${20 / 12}vh`, //  20,
          backgroundColor: "#ECF0F6",
          "& > div": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${88 / 19.2}vw`, //  88,
            height: `${88 / 12}vh`, //  88
            borderRadius: "50%",
            background: theme.palette[`light${capitalize(color)}`],
            "& > img": {
              width: `${48 / 19.2}vw`, //  48,
              height: `${48 / 12}vh`, //  48
            },
          },
        },
        "& > .contentWrapper": {
          flex: 1,
          fontSize: `${40 / 12}vh`, //  40,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "pre",
          textAlign: "center",
        },
        "& > .endIconWrapper": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& svg": {
            width: `${52 / 19.2}vw`, //  52,
            height: `${52 / 12}vh`, //  52
          },
        },
      }}
    >
      <div className="startIconWrapper">
        <div>{startIcon}</div>
      </div>
      <Typography className="contentWrapper">{content}</Typography>
      <div className="endIconWrapper">{endIcon}</div>
    </Button>
  );
};
