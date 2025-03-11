
const { retrieveAllTopics } = require("../models/topics.models")

const getAllTopics = (request, response, next) =>{

retrieveAllTopics().then((topics)=>{
response.status(200).send({topics})
}).catch((err)=>{
    next(err)
})
}

module.exports = {getAllTopics}