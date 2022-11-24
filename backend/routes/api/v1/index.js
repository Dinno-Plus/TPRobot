const { execSync } = require("child_process");
const express = require("express");
const router = express.Router();
const path = require("path");
const Mutex = require("async-mutex").Mutex;

const rosnodejs = require("rosnodejs");
const sensor_msgs = rosnodejs.require("sensor_msgs").msg;
const cona_msgs = rosnodejs.require("cona").srv;

const version = execSync("git rev-list --all --count").toString().trim();

let srvCmd = null;
let subImg = null;
let lastMapName = null;
let imgBase64;
let mtx = new Mutex();

rosnodejs.initNode("/guiServer").then((rosNode) => {
  srvCmd = rosNode.serviceClient("/cmdGUI_v2", cona_msgs.cmd_srv);
  subImg = rosNode.subscribe("/imgGUI", sensor_msgs.CompressedImage, (data) => {
    var buf = Buffer.from(data.data);
    imgBase64 = buf.toString("base64");
  });
});

// NOTE  POST /
// @desc    Get/Set with cmd
// @route   POST /api/v1
// @access  public
router.post("/", async (req, res) => {
  await mtx.runExclusive(async () => {
    try {
      req.body.version = "gui_v2." + version;

      let response = null;
      let req_msg = new cona_msgs.cmd_srv.Request();
      switch (req.body.cmd) {
        // Get Commands
        case "getRobot":
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              let response_root = JSON.parse(res_msg.response);
              response = response_root.getRobot;
            });
          }
          break;
        case "getMaps":
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              let response_root = JSON.parse(res_msg.response);
              response = response_root.getMaps;
              response.img = imgBase64;

              const selectedMap = response.maps.find((map) => map.selected);
              if (selectedMap) {
                lastMapName = selectedMap.name;
              }
            });
          }
          break;
        case "getUserSettings":
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              let response_root = JSON.parse(res_msg.response);
              response = response_root.getUserSettings;
            });
          }
          break;
        case "getManagerSettings":
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              let response_root = JSON.parse(res_msg.response);
              response = response_root.getManagerSettings;
            });
          }
          break;
        case "getSystemLog":
          //do something
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              let response_root = JSON.parse(res_msg.response);
              response = response_root.getSystemLog;
            });
          }
          break;
        case "getDrivingLog":
          //do something
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              let response_root = JSON.parse(res_msg.response);
              response = response_root.getDrivingLog;
            });
          }
          break;

        // Set Commands
        case "setRobot":
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              response = { msg: "ok" };
            });
          }
          break;
        case "setMaps":
          if (srvCmd) {
            if (req.body.value == "save") {
              if (lastMapName) {
                req.body.name = lastMapName;
              } else {
                req.body.name = "";
              }
            } else if (req.body.value == "load") {
              lastMapName = req.body.name;
            }
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              response = { msg: "ok" };
            });
          }
          break;
        case "setUserSettings":
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              response = { msg: "ok" };
            });
          }
          break;
        case "setManagerSettings":
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              response = { msg: "ok" };
            });
          }
          break;
        case "setSystem":
          if (srvCmd) {
            req_msg.request = JSON.stringify(req.body);
            await srvCmd.call(req_msg).then((res_msg) => {
              response = { msg: "ok" };
            });
          }
          break;

        default:
          break;
      }
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ msg: "Something is broken." });
    }
  });
});

module.exports = router;
