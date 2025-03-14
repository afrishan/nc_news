const articles = require("../db/data/test-data/articles")
const { checkExists } = require("../db/seeds/utils")
const { retrieveArticleByArticleId, retreiveAllArticles, updateArticleByArticleId } = require("../models/articles.models")


const getArticleByArticleId = (request, response, next) =>{
    const id = request.params.article_id
    retrieveArticleByArticleId(id).then((article)=>{
    response.status(200).send({article})
}).catch((err)=>{
    next(err)
})
}

const getAllArticles = (request, response, next) =>{
const sortByQuery = request.query.sort_by
const  order = request.query.order
const topicQuery = request.query.topic
    
const promises = [retreiveAllArticles(sortByQuery, order, topicQuery)]

if(topicQuery){
    promises.push(checkExists("articles", "topic", topicQuery))
}

Promise.all(promises).then(([articles])=>{
    response.status(200).send({articles})
})
.catch((err)=>{
    next(err)
})
}

const patchArticleByArticleId = (request, response, next) =>{
const id = request.params.article_id
const {inc_votes} = request.body

    updateArticleByArticleId(inc_votes, id).then((article)=>{
        response.status(200).send({article})
    }).catch((err)=>{
        next(err)
    })
}
module.exports = {getArticleByArticleId, getAllArticles, patchArticleByArticleId}