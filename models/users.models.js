const db = require("../db/connection")

const retrieveAllUsers = () => {
return db.query(
    `SELECT * FROM users`
).then(({rows})=>{
    console.log(rows)
    return rows
})
}

module.exports = { retrieveAllUsers }