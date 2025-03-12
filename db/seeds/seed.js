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
  .then(()=>{
    const formattedTopics = formatTopicsData(topicData)
    return db.query(format('INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;', formattedTopics))
  })
  
  .then(()=>{
    const formattedUsers = formatUsersData(userData)
    return db.query(format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *`, formattedUsers))
  })
  .then(()=>{
    const articleDataWithDate = articleData.map((article) =>  { return convertTimestampToDate(article)})
    const formattedArticles = formatArticlesData(articleDataWithDate)
    return db.query(format(`INSERT INTO articles (title, body, topic, author, created_at, article_img_url, votes) VALUES %L RETURNING *;`, formattedArticles))

  })
    .then((articlesTable)=>{
      const commentsWithId = formatComments(commentData,articlesTable.rows)
      const response = commentsWithId.map((comment) => { return convertTimestampToDate(comment)})
      const formattedComments = formatCommentsData(response)
      return db.query(format(`INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L RETURNING *;`, formattedComments))
    });
 

};


// functions for creating tables
function createTopics(){
return db.query(`CREATE TABLE topics  (slug VARCHAR(100) PRIMARY KEY, description VARCHAR(500), img_url VARCHAR(1000))`)
}
function createUsers(){
  return db.query(`CREATE TABLE users (username VARCHAR(100) PRIMARY KEY, name VARCHAR(50), avatar_url VARCHAR(1000))`)
}
function createArticles(){
  return db.query(`CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR(100), topic VARCHAR(100) NOT NULL, CONSTRAINT fk_topic FOREIGN KEY (topic) REFERENCES topics(slug), author VARCHAR(100) NOT NULL, CONSTRAINT fk_author FOREIGN KEY (author) REFERENCES users(username), body TEXT, created_at TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000))`)
}
function createComments(){
  return db.query(`CREATE TABLE comments  (comment_id SERIAL PRIMARY KEY, article_id INT NOT NULL, CONSTRAINT fk_article_id FOREIGN KEY (article_id) REFERENCES articles(article_id), body TEXT, author VARCHAR(100) NOT NULL, CONSTRAINT fk_author FOREIGN KEY (author) REFERENCES users(username), votes INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)
}


module.exports = seed;
