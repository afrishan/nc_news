const db = require("../db/connection")

retrieveAllCommentsByArticleId = (id)=> {
    return db.query(
        `SELECT * 
        FROM comments
        WHERE article_id = $1`, [id]
    )
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({ code: 404, msg: "not found" })
        }
    return rows
    })

}

module.exports ={retrieveAllCommentsByArticleId}