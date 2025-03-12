
const { get } = require("../app")
const articles = require("../db/data/test-data/articles")
const { retrieveArticleByArticleId, retreiveAllArticles } = require("../models/articles.models")


const getArticleByArticleId = (request, response, next) =>{
    const id = request.params.article_id
    retrieveArticleByArticleId(id).then((article)=>{
    response.status(200).send({article})
}).catch((err)=>{
    next(err)
})
}

const getAllArticles = (request, response, next) =>{

    retreiveAllArticles().then((articles)=>{
    response.status(200).send({articles})
})
.catch((err)=>{
    next(err)
})
}
module.exports = {getArticleByArticleId, getAllArticles}