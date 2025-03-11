
const { retrieveArticleByArticleId } = require("../models/articles.models")


const getArticleByArticleId = (request, response, next) =>{
    const id = request.params.article_id
    console.log(id)
    retrieveArticleByArticleId(id).then((article)=>{

    response.status(200).send({article})
}).catch((err)=>{
    next(err)
})
}

module.exports = {getArticleByArticleId}