const express = require("express");
const clientRouter = require("./client");
const interventionRouter = require("./intervention");
const authRouter = require("./auth");
const app = express();

app.use("/client/", clientRouter);
app.use("/intervention/", interventionRouter);
app.use("/auth/", authRouter);

module.exports = app;