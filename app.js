const express = require("express")
const app = express()
const getAllApis = require("./controllers/api.controller")

const { getAllTopics } = require("./controllers/topics.controllers");
const { getArticleByArticleId } = require("./controllers/articles.controllers");



app.get(`/api`, getAllApis);
app.get(`/api/topics`, getAllTopics);
app.get(`/api/articles/:article_id`, getArticleByArticleId)


app.all("*", (request, response) => {
    response.status(404).send({ msg: "path not found" });
  });


  app.use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "bad request" });
    }
    next(err);
  });

  app.use((err, req, res, next) => {
    if (err.code) {
      res.status(err.code).send({ msg: err.msg });
    }
    next(err);
  });