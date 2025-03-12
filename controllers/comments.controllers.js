const { retrieveAllCommentsByArticleId, addNewCommentbyArticleId } = require("../models/comments.models")

const getAllCommentsByArticleId = (request, response, next)=>{
const id = request.params.article_id

retrieveAllCommentsByArticleId(id).then((comments)=>{
    response.status(200).send({comments})
}).catch((err)=>{
    next(err)
})
}

const postACommentByArticleId = (request, response, next)=>{
const {username, body} = request.body
const id = request.params.article_id

addNewCommentbyArticleId(username, body, id)
.then((comment)=>{
response.status(201).send({comment})
})
.catch((err)=>{
    next(err)
})
}

module.exports = {getAllCommentsByArticleId, postACommentByArticleId}