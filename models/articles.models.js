const db = require("../db/connection")

const retrieveArticleByArticleId = (id) =>{

return db.query(`
    SELECT articles.* , CAST(COALESCE(COUNT(comments.comment_id), 0) AS integer) AS comment_count
FROM articles 
LEFT JOIN comments ON comments.article_id = articles.article_id
WHERE articles.article_id = $1
GROUP BY articles.article_id`, [id])
.then(({rows})=>{

    if (rows.length === 0){
        return Promise.reject({ code: 404, msg: "not found" })
    }
    return rows[0]
}) 
}

const retreiveAllArticles = (sortByQuery, order, topicQuery)=>{

let queryString = 
`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COALESCE(COUNT(comments.comment_id), 0) AS integer) AS comment_count
FROM articles 
LEFT JOIN comments ON comments.article_id = articles.article_id`

const inputTopic = []
if (topicQuery) {
    queryString += ` WHERE articles.topic = $1`;
    inputTopic.push(topicQuery)
  }

queryString +=  ` GROUP BY articles.article_id`
const querySort = sortByQuery || "created_at"

const validColumns = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url"]

if (!validColumns.includes(querySort)) {
    return Promise.reject({ code: 400, msg: "bad request" })
}
if (validColumns.includes(querySort)) {
    queryString += ` ORDER BY ${querySort}`
}

const queryOrder = order || `DESC`
const validOrder = ["asc", "desc"];

if(order === undefined) {
queryString += ` DESC`;
}

if (order) {
if (!validOrder.includes(order)) {
    return Promise.reject({ code: 400, msg: "bad request" });
}  
if (validOrder.includes(order)) {
    queryString += ` ${queryOrder}`
}
}
return db.query(queryString, inputTopic)
.then(({rows})=>{
    
    return rows
})
}

const updateArticleByArticleId = (inc_votes, id)=>{

    if(inc_votes === undefined) {
        return Promise.reject({ code: 400, msg: "bad request"})
    }

    return db.query(
        `
        UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
        `, [inc_votes, id]
    )
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({ code: 404, msg: "not found" })
        }
    return rows[0]
})
}
module.exports = {retrieveArticleByArticleId, retreiveAllArticles, updateArticleByArticleId}