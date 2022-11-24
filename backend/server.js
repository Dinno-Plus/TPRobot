const path = require("path");

const colors = require("colors");
const express = require("express");
const morgan = require("morgan");

// Set Config
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

// Create an express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  morgan((tokens, req, res) =>
    [
      `[${tokens.date(req, res, "clf")}]`,
      colors.yellow(tokens["remote-addr"](req, res)),
      colors.cyan(`HTTP/${tokens["http-version"](req, res)}`),
      colors.blue(tokens.method(req, res)),
      colors.green(tokens.url(req, res)),
      colors.green(req.body),
      colors.white(tokens.status(req, res)),
      colors.red(
        `${tokens.res(req, res, "content-length")} - ${
          tokens["response-time"](req, res, 1) + "ms"
        }`
      ),
    ].join(" ")
  )
);

// Api routes
if (process.env.NODE_ENV === "production") {
  app.use("/api/v1", require("./routes/api/v1"));
} else {
  app.use("/api/v1", require("./routes/api/dev"));
}

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

// Starts the HTTP server listening for connections
app.listen(
  PORT,
  console.log(
    colors.cyan.bold(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  )
);
