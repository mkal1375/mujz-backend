const express = require("express");
const apiRouter = require("./api/routes.js");
const Deta = require("deta").Deta;
const redirecting = require("./api/controllers.js").redirecting;
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const port = 1375;
const app = express();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
};
app.use(cors(corsOptions));

app.use(express.json());

// Connect to Database
const deta = Deta("a0o4zw9z_MPrYTPogvQGQvEnE9P9hziR42FbzK8gc");
const db = deta.Base("mujz");
app.set("db", db);

app.listen(port, () => {
  console.log(`Application is running on http//localhost:${port}.`);
});

app.use("/api/", apiRouter);
app.get("/:key", redirecting);
app.use("/", express.static("build"));

module.exports = app;
