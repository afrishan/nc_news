const { retrieveAllUsers } = require("../models/users.models")

const getAllUsers = (request, response, next) => {
    retrieveAllUsers().then((users)=>{
    response.status(200).send({users})
}).catch((err)=>{
    next(err)
})
}

module.exports = {getAllUsers}