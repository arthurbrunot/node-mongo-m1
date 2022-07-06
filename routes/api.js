const express = require("express");
const clientRouter = require("./client");
const interventionRouter = require("./intervention");
const app = express();

app.use("/client/", clientRouter);
app.use("/intervention/", interventionRouter);

module.exports = app;