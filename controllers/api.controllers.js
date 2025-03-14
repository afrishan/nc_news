
const endpoints = require("../endpoints.json")

const getAllApis = (request, response, next)=>{
response.status(200).send({endpoints})
}

module.exports = getAllApis