 const db = require("../db/connection")

const retrieveArticleByArticleId = (id) =>{

return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
.then(({rows})=>{
    if (rows.length === 0){
        return Promise.reject({ code: 404, msg: "not found" })
    }
    return rows[0]
}) 
}

const retreiveAllArticles = ()=>{

return db.query(
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COALESCE(COUNT(comments.comment_id), 0) AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`)
.then(({rows})=>{

    return rows

})
}
module.exports = {retrieveArticleByArticleId, retreiveAllArticles}