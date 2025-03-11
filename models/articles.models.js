 const db = require("../db/connection")

const retrieveArticleByArticleId = (id) =>{

return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({rows})=>{
    if (rows.length === 0){
        return Promise.reject({ code: 404, msg: "not found" })
    }
    return rows[0]
})
}
module.exports = {retrieveArticleByArticleId}