import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  InputBase,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/material";

import {
  CheckBoldIcon,
  ContentSaveIcon,
  FolderOpenIcon,
  ReloadIcon,
} from "../components/icons";
import { playButtonClickSound } from "../utils";
import { systemActions, managerSettingsActions } from "../store";
import { useInterval } from "../hooks";
import { getLogInterval } from "../constants";
import { services } from "../services";

export const ManagerSettings = () => {
  const [log, setLog] = useState("");
  const [loadSystemLog, setLoadSystemLog] = useState(false);
  const [loadDrivingLog, setLoadDrivingLog] = useState(false);
  const managerSettings = useSelector((state) => state.managerSettings);
  const theme = useTheme();
  const dispatch = useDispatch();

  useInterval(async () => {
    let log;
    if (loadSystemLog) {
      const systemLog = await services.getSystemLog();
      log = systemLog.logs;
      setLog((l) => log + "\\n" + l);
    } else if (loadDrivingLog) {
      const drivingLog = await services.getDrivingLog();
      const timestamp = new Date().toLocaleTimeString();
      log = `[${timestamp}] ${JSON.stringify(drivingLog)
        .replaceAll('"', "")
        .replaceAll(":", ": ")
        .replaceAll(",", ", ")}`;
      setLog((l) => log + "\\n" + l);
    }
  }, getLogInterval);

  const handleSaveClick = () => {
    playButtonClickSound();
    dispatch(systemActions.set("saveManagerSettings"));
  };
  const handleLoadClick = () => {
    playButtonClickSound();
    dispatch(systemActions.set("loadManagerSettings"));
  };
  const handleResetClick = () => {
    playButtonClickSound();
    dispatch(systemActions.set("resetManagerSettings"));
    dispatch(managerSettingsActions.get());
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (event.target.name.includes("parm")) {
      dispatch(managerSettingsActions.change({ name, value }));
    } else {
      playButtonClickSound();
      let newManagerSettings;
      if (name === "numTrays" && Number(value) === 4) {
        newManagerSettings = { ...managerSettings, numTrays: 4, numDrawers: 1 };
      } else if (name === "numTrays" && Number(value) === 5) {
        newManagerSettings = { ...managerSettings, numTrays: 5, numDrawers: 0 };
      } else {
        newManagerSettings = { ...managerSettings, [name]: Number(value) };
      }
      dispatch(managerSettingsActions.set(newManagerSettings));
    }
  };
  const handleSetParm = () => {
    playButtonClickSound();
    dispatch(managerSettingsActions.set(managerSettings));
  };

  const handleGetSystemLog = () => {
    playButtonClickSound();
    setLoadSystemLog(true);
    setLoadDrivingLog(false);
    setLog("");
  };
  const handleGetDrivingLog = () => {
    playButtonClickSound();
    setLoadSystemLog(false);
    setLoadDrivingLog(true);
    setLog("");
  };

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
          fontSize: `${36 / 12}vh`, //  36,
          fontWeight: 500,
        },
        "& h3": {
          fontSize: `${32 / 12}vh`, //  32,
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
              borderRadius: 24,
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
          gap: `${28 / 12}vh`, // 28,
          margin: `${24 / 12}vh ${20 / 19.2}vw ${0}px`, // `${24}px ${20}px ${0}px`,
          padding: `${28 / 12}vh ${28 / 19.2}vw`, //28,
          backgroundColor: theme.palette.grey[900],
          border: `${2 / 12}vh solid ${theme.palette.grey[800]}`, //`${2}px solid ${theme.palette.grey[800]}`,
          borderRadius: `${16 / 12}vh`, //  16,
          "& > hr": { backgroundColor: theme.palette.grey[800] },
          "& > .section1": {
            display: "flex",
            "& > div": {
              flex: 1,
              display: "flex",
              alignItems: "center",
              "& > h2": {
                marginRight: `${80 / 19.2}vw`, //  80,
              },
              "& > .radioGroup": {
                display: "flex",
                flexDirection: "row",
                gap: `${40 / 19.2}vw`, //  40,
                fontSize: `${28 / 12}vh`, // 28,
                "& svg": {
                  width: `${40 / 19.2}vw`, // 40,
                  height: `${40 / 12}vh`, //  40,
                },
                "& .Mui-disabled": { color: theme.palette.grey[800] },
              },
            },
          },
          "& > .section2": {
            "& > .title": {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: `${16 / 12}vh`, // 16,
              "& > button": {
                display: "flex",
                justifyContent: "space-between",
                fontSize: `${28 / 12}vh`, // 28,
                borderRadius: `${16 / 12}vh`, // 16,
                width: `${240 / 19.2}vw`, // 240,
                padding: `${8 / 12}vh ${28 / 19.2}vw`, // `${8}px ${28}px`,
                fontWeight: 400,
                background: theme.palette.grey[850],
                border: `${3 / 12}vh solid ${theme.palette.secondary.main}`, // `${3}px solid ${theme.palette.secondary.main}`,
                "& svg": {
                  width: `${36 / 19.2}vw`, // 36,
                  height: `${36 / 12}vh`, //  36,
                },
              },
            },
            "& > .parmWrapper": {
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gridTemplateRows: "repeat(3,1fr)",
              gap: `${28 / 12}vh ${80 / 19.2}vw`, // `${28}px ${80}px`,
              "& > div": {
                display: "flex",
                alignItems: "center",
                gap: `${28 / 19.2}vw`, // 28,
                "& > div": {
                  flex: 1,
                  padding: `${4 / 12}vh ${16 / 19.2}vw`, // `${4}px ${16}px`,
                  fontSize: `${24 / 12}vh`, // 24,
                  backgroundColor: theme.palette.grey[850],
                  height: `${44 / 12}vh`, // 44,
                },
              },
            },
          },
          "& > .section3": {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            "& > .title": {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: `${16 / 12}vh`, // 16,
              "& > .buttonGroup": {
                display: "flex",
                gap: `${24 / 19.2}vw`, // 24,
                "& > button": {
                  fontSize: `${28 / 12}vh`, // 28,
                  borderRadius: `${16 / 12}vh`, // 16,
                  width: `${320 / 19.2}vw`, // 320,
                  padding: `${8 / 12}vh ${28 / 19.2}vw`, //`${8}px ${28}px`,
                  fontWeight: 400,
                  background: theme.palette.grey[850],
                  border: `${3 / 12}vh solid ${theme.palette.secondary.main}`, // `${3}px solid ${theme.palette.secondary.main}`,
                },
              },
            },
            "& > .logWrapper": {
              flex: 1,
              position: "relative",
              backgroundColor: theme.palette.grey[850],
              padding: `${8 / 12}vh ${16 / 19.2}vw`, //`${8}px ${16}px`,
              "& > .log": {
                position: "absolute",
                top: `${8 / 12}vh`, // 8,
                bottom: `${8 / 12}vh`, // 8,
                left: `${16 / 19.2}vw`, //  16,
                right: `${16 / 19.2}vw`, // 16,
                overflow: "auto",
                "& > p": {
                  fontSize: `${24 / 12}vh`, //  24,
                },
              },
            },
          },
        },
      }}
    >
      <div className="header">
        <Typography variant="h1">관리자 설정</Typography>
        <div className="buttonGroup">
          <Button onClick={handleSaveClick}>
            <span>저장하기</span>
            <ContentSaveIcon />
          </Button>
          <Button onClick={handleLoadClick}>
            <span>불러오기</span>
            <FolderOpenIcon />
          </Button>
          <Button onClick={handleResetClick}>
            <span>초기화</span>
            <ReloadIcon />
          </Button>
        </div>
      </div>

      <div className="content">
        <div className="section1">
          <div>
            <Typography variant="h2">서랍 유무</Typography>
            <RadioGroup
              className="radioGroup"
              name="numDrawers"
              value={managerSettings.numDrawers}
              onChange={handleChange}
            >
              <FormControlLabel
                value={1}
                disabled={managerSettings.numTrays === 5}
                control={<Radio />}
                label="있음"
              />
              <FormControlLabel
                value={0}
                disabled={managerSettings.numTrays === 4}
                control={<Radio />}
                label="없음"
              />
            </RadioGroup>
          </div>
          <div>
            <Typography variant="h2">선반 개수</Typography>
            <RadioGroup
              className="radioGroup"
              name="numTrays"
              value={managerSettings.numTrays}
              onChange={handleChange}
            >
              <FormControlLabel value={2} control={<Radio />} label="2개" />
              <FormControlLabel value={3} control={<Radio />} label="3개" />
              <FormControlLabel value={4} control={<Radio />} label="4개" />
              <FormControlLabel value={5} control={<Radio />} label="5개" />
            </RadioGroup>
          </div>
        </div>

        <Divider />

        <div className="section2">
          <div className="title">
            <Typography variant="h2">파라미터 세팅</Typography>
            <Button onClick={handleSetParm}>
              적용하기
              <CheckBoldIcon />
            </Button>
          </div>
          <div className="parmWrapper">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx}>
                <Typography variant="h3">{`parm${idx}`}</Typography>
                <InputBase
                  name={`parm${idx}`}
                  value={managerSettings[`parm${idx}`]}
                  autoComplete="off"
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className="section3">
          <div className="title">
            <Typography variant="h2">데이터 로그 읽어 오기</Typography>
            <div className="buttonGroup">
              <Button onClick={handleGetSystemLog}>
                시스템 로그 읽어 오기
              </Button>
              <Button onClick={handleGetDrivingLog}>주행 로그 읽어 오기</Button>
            </div>
          </div>
          <div className="logWrapper">
            <div className="log">
              {log.split("\\n").map((l, idx) => (
                <Typography key={idx}>{l}</Typography>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};
