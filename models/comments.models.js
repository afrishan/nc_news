const db = require("../db/connection")

const retrieveAllCommentsByArticleId = (id)=> {
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

const addNewCommentbyArticleId = (username, body, id)=>{


    if(username === undefined || body === undefined) {
        return Promise.reject({code:400, msg:"bad request"})
    }

    return db.query(
        `INSERT INTO comments (author, body, article_id) 
        VALUES ($1, $2, $3) 
        RETURNING *`,
        [username, body, id]
    ).then(({rows})=>{
        
        if (rows.length === 0){
            return Promise.reject({ code: 404, msg: "not found" })
        }
    return rows[0]
    })

}

const removeCommentByCommentId = (id) =>{

    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`, [id]
    ).then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({ code: 404, msg: "not found" })
        }
        return rows[0]
    })
}

module.exports ={retrieveAllCommentsByArticleId, addNewCommentbyArticleId, removeCommentByCommentId}