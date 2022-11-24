const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

let robot = {
  promise: "none", //"none" | "pending" | "fulfilled" | "rejected",
  state: "loading", // "loading", "ready", "going", "arrived", "emergency", "charging"
  mode: "none", // "none", "serving", "cruising", "calling"
  goal: { table: "", tray: [] }, // table: 홈은 "홈", 충전은 "충전", tray: [트레이 번호 위에서 부터 0, 1, ... ex) 0, 2 = 제일 위 트레이, 위에서 세번째 트레이]
  nextGoal: { table: "", tray: [] }, // 없는 경우: {table: "", tray: []}, 홈/충전은 우선은 1개 장소만, 추후 늘어날 수 있는 것 생각하여 진행
  progress: 0, // 0~100
  battery: 100, // 0~100
  pause: false, // true: 일시정지, false: 일시정지 아님
  error: null, // { type: String, // "information", "warning", "error"     msg: String // "센서 1번이 블라블라"  } // null, undefined, 필드 없음 가능
};
let goals = [];
let userSettings = {
  brightness: 1, // 0.5~1, step=0.005
  volume: 0.8, // 0~1, step=0.01
  voice: "baseFemale", // "baseFemale", "baseMale", "child", "user"
  alert: "alert1", // "alert1", "alert2", "alert3"
  music: "music1", // "music1", "music2", "music3"
  speed: 0.7, // 0.1~1.5, step=0.1
  light: "on", // "on", "off"
  avoid: "avoid1", // "avoid1", "avoid2", "avoid3"
  mappingPassword: "170824", // text
};
let managerSettings = {
  numDrawers: 1, // 0, 1
  numTrays: 3, // 2, 3, 4
  parm1: "", // String
  parm2: "", // String
  parm3: "", // String
  parm4: "", // String
  parm5: "", // String
  parm6: "", // String
};

const generateDummyDestinations = (numDest) => {
  // const engChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const words = require("./dummy/words.json");
  const types = ["none", "none", "none", "none", "none", "home", "charge"];

  return [...words]
    .sort((_) => Math.random() - 0.5)
    .slice(0, numDest)
    .map((name) => {
      const type = types[Math.floor(Math.random() * types.length)];

      return { name, type };
    });
};
let maps = {
  img: fs
    .readFileSync(path.resolve(__dirname, "./dummy/c.jpg"))
    .toString("base64"), // Base64 인코딩한 현재 선택된 맵의 이미지
  mode: "Topologic", //  "Topologic", "Metric"
  maps: [
    {
      name: "지도 및 경로 A",
      selected: true,
      destinations: [
        { name: "홈", type: "home" },
        ...generateDummyDestinations(34),
      ],
    }, // true: 현재 선택됨, false: 선택 안됨
    {
      name: "지도 및 경로 B",
      selected: false,
      destinations: [
        { name: "홈", type: "home" },
        ...generateDummyDestinations(46),
      ],
    },
    {
      name: "지도 및 경로 C",
      selected: false,
      destinations: [
        { name: "홈", type: "home" },
        ...generateDummyDestinations(80),
      ],
    },
    {
      name: "지도 및 경로 D",
      selected: false,
      destinations: [
        { name: "홈", type: "home" },
        ...generateDummyDestinations(0),
      ],
    },
    {
      name: "지도 및 경로 E",
      selected: false,
      destinations: [
        { name: "홈", type: "home" },
        ...generateDummyDestinations(4),
      ],
    },
  ],
};

// NOTE  POST /
// @desc    Get/Set with cmd
// @route   POST /api/v1
// @access  public
router.post("/", async (req, res) => {
  try {
    let response = null;
    switch (req.body.cmd) {
      // Get Commands
      case "getRobot":
        if (robot.state === "loading") {
          setTimeout(() => {
            robot.state = "ready";
            robot.battery = 50;
          }, 1000);
        }
        if (robot.state === "going" && !robot.pause) {
          robot.progress = robot.progress + 5;
        }
        if (robot.state === "going" && robot.progress >= 100) {
          robot.state = "arrived";
          robot.progress = 0;
        }
        response = robot;
        break;
      case "getUserSettings":
        response = userSettings;
        break;
      case "getManagerSettings":
        response = managerSettings;
        break;
      case "getMaps":
        response = maps;
        break;
      case "getSystemLog":
        //do something
        response = {
          logs: "this is system log\\n this is system log2\\n this is system log3\\n", // String, \n 표시로 split해서 줄 구분하여 보여 줘야함
        };
        break;
      case "getDrivingLog":
        //do something
        response = {
          robotName: "servinggo1", // String,
          voltage: 23, //20~29
          state: "dummyState", //위 getState와 동일
          totalMileage: 12.35, //Double, m
          totalRuntime: 36281, //Int, sec
          numDelivery: 25, //Int,
        };
        break;

      // Set Commands
      case "setRobot":
        if (req.body.value.mode === "serving") {
          goals = req.body.value.goals;
          goals.push({ table: "홈", tray: [] });
          goals.push({ table: "", tray: [] });
          robot.state = "going";
          robot.mode = "serving";
          robot.goal = goals.shift();
          robot.nextGoal = goals.shift();
        } else if (req.body.value.mode === "cruising") {
          goals = req.body.value.goals;
          robot.state = "going";
          robot.mode = "cruising";
          robot.goal = goals.shift();
          robot.nextGoal = goals.shift();
          goals = [...goals, robot.goal, robot.nextGoal];
        } else if (req.body.value.state === "going") {
          robot.state = "going";
          robot.progress = 0;
          robot.goal = req.body.value.goal;
          if (robot.mode === "serving") {
            robot.nextGoal = goals.shift();
          } else if (robot.mode === "cruising") {
            robot.nextGoal = goals.shift();
            goals = [...goals, robot.nextGoal];
          } else if (robot.mode === "calling") {
            if (robot.goal.table === "홈") {
              robot.nextGoal = { table: "", tray: [] };
            } else {
              robot.nextGoal = { table: "홈", tray: [] };
            }
          } else if (robot.mode === "none") {
            robot.nextGoal = { table: "", tray: [] };
          }
        } else {
          robot = { ...robot, ...req.body.value };
        }

        response = { msg: "ok" };
        break;
      case "setMaps":
        if (req.body.value === "mode") {
          maps.mode = req.body.mode;
        } else if (req.body.value === "load") {
          maps.maps = maps.maps.map(({ name, destinations }) => ({
            name,
            selected: name === req.body.name,
            destinations,
          }));
        } else if (req.body.value === "change") {
          maps.maps = maps.maps.map((m) =>
            m.selected ? { ...m, destinations: req.body.destinations } : m
          );
        }
        response = { msg: "ok" };
        break;
      case "setMapMode":
        response = { msg: "ok" };
        break;
      case "setUserSettings":
        userSettings = req.body.value;
        response = { msg: "ok" };
        break;
      case "setManagerSettings":
        managerSettings = req.body.value;
        response = { msg: "ok" };
        break;
      case "setSystem":
        response = { msg: "ok" };
        break;

      default:
        break;
    }
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something is broken." });
  }
});

module.exports = router;
