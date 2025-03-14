const express = require("express")
const app = express()
const getAllApis = require("./controllers/api.controllers")

const { getAllTopics } = require("./controllers/topics.controllers");
const { getArticleByArticleId, getAllArticles, patchArticleByArticleId } = require("./controllers/articles.controllers");
const { getAllCommentsByArticleId, postACommentByArticleId, deleteCommentByCommentId } = require("./controllers/comments.controllers");
const { getAllUsers } = require("./controllers/users.controllers");


app.use(express.json())

app.get(`/api`, getAllApis);
app.get(`/api/topics`, getAllTopics);
app.get(`/api/articles/:article_id`, getArticleByArticleId)
app.get(`/api/articles`, getAllArticles)
app.get(`/api/articles/:article_id/comments`, getAllCommentsByArticleId)
app.post(`/api/articles/:article_id/comments`, postACommentByArticleId)
app.patch(`/api/articles/:article_id`, patchArticleByArticleId)
app.delete(`/api/comments/:comment_id`, deleteCommentByCommentId)
app.get(`/api/users`, getAllUsers)


app.all("*", (request, response) => {
    response.status(404).send({ msg: "not found" });
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

  app.use((err, req, res, next) => {
    res.status(500).send({ message: "Internal Server Error" });
  });

  module.exports = app