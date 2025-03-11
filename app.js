const express = require("express")
const app = express()
const getAllApis = require("./controllers/api.controller")
const { getAllTopics } = require("./controllers/topics.controllers")

app.get(`/api`, getAllApis);
app.get(`/api/topics`, getAllTopics);

app.all("*", (request, response) => {
    response.status(404).send({ msg: "path not found" });
  });

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app