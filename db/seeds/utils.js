const db = require("../../db/connection");
const format = require("pg-format")

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.searchArticles = (data) =>{
  if (data.length === 0) return {}
  const articleLookup = {}

  for (let i = 0; i < data.length; i++) {
    articleLookup[data[i].title] = data[i].article_id
  }

  return articleLookup
}

exports.formatComments = (comments, articleData) => {
  const idLookup =  this.searchArticles(articleData)

  const updatedComments = []
  for (let i = 0; i < comments.length; i++){

  updatedComments.push(
    {
      article_id: idLookup[comments[i].article_title],
      body: comments[i].body,
      votes: comments[i].votes,
      author: comments[i].author ,
      created_at: comments[i].created_at
    })
 }

  return updatedComments
}

exports.formatTopicsData = (data) => {
  return data.map((topic) => {
    return [topic.slug, topic.description, topic.img_url]
  })
}

exports.formatUsersData = (data) => {
  return data.map((user) => {
    return [user.username, user.name, user.avatar_url]
  })
}

exports.formatArticlesData = (data) => {
  return data.map((article) => {
    return [article.title, article.body, article.topic, article.author, article.created_at, article.article_img_url, article.votes]  
  })
}

exports.formatCommentsData = (data) => {
  return data.map((comment) => {
  return [comment.body, comment.votes, comment.author, comment.article_id, comment.created_at]
  })
}

exports.checkExists = async (table, column, value) => {

  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ code: 404, msg: "not found" });
  }
}