const db = require("../db/connection")

retrieveAllTopics = () => {
return db.query(`SELECT * FROM topics`).then(({rows})=>{
    return rows
})
}

module.exports = {retrieveAllTopics}