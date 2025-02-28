const db = require("../connection");
const format = require('pg-format');
const { formatTopicsData, formatUsersData, convertTimestampToDate, formatArticlesData, formatComments, formatCommentsData } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS articles`)
  })
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS users`)
  })
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS topics`)
  })
  .then(()=>{
    return createTopics()
  })
  .then(()=>{
    return createUsers()
  })
  .then(()=>{
    return createArticles()
  })
  .then(()=>{
    return createComments()
  })
  .then(()=> {
    return formatTopicsData(topicData)
   
  })
  .then((formattedTopics)=>{
    return db.query(format('INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;', formattedTopics))
  })
  .then(()=>{
    
    return formatUsersData(userData)
  })
  .then((formattedUsers)=>{
    return db.query(format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *`, formattedUsers))
  })
  .then(()=>{
   return articleData.map((article) => 
    { return convertTimestampToDate(article)})
  })
  .then((articleDataWithDate)=>{
    return formatArticlesData(articleDataWithDate)
  })
  .then((formattedArticles)=>{
    return db.query(format(`INSERT INTO articles (title, body, topic, author, created_at, article_img_url) VALUES %L RETURNING *;`, formattedArticles))

  }).then((articlesTable)=>{
     const commentsWithId = formatComments(commentData,articlesTable.rows)
     return commentsWithId
  })
  .then((commentsWithId)=>{
     return commentsWithId.map((comment) => { return convertTimestampToDate(comment)})
  })
.then((response)=>{
  console.log(formatCommentsData(response))
  return formatCommentsData(response)
    })
    .then((formattedComments)=>{
      return db.query(format(`INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L RETURNING *;`, formattedComments))
    })
  ;
 

};


// functions for creating tables
function createTopics(){
return db.query(`CREATE TABLE topics  (slug VARCHAR(100) PRIMARY KEY, description VARCHAR(500), img_url VARCHAR(1000))`)
}
function createUsers(){
  return db.query(`CREATE TABLE users (username VARCHAR(100) PRIMARY KEY, name VARCHAR(50), avatar_url VARCHAR(1000))`)
}
function createArticles(){
  return db.query(`CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR(100), topic VARCHAR(100), author VARCHAR(100), CONSTRAINT fk_author FOREIGN KEY (author) REFERENCES users(username), body TEXT, created_at TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000))`)
}
function createComments(){
  return db.query(`CREATE TABLE comments  (comment_id SERIAL PRIMARY KEY, article_id INT, CONSTRAINT fk_article_id FOREIGN KEY (article_id) REFERENCES articles(article_id), body TEXT, author VARCHAR(100), CONSTRAINT fk_author FOREIGN KEY (author) REFERENCES users(username), votes INT DEFAULT 0, created_at TIMESTAMP)`)
}


module.exports = seed;
