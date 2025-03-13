const { checkExists } = require("../db/seeds/utils")
const { retrieveAllCommentsByArticleId, addNewCommentbyArticleId, removeCommentByCommentId } = require("../models/comments.models")

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

const promises = [addNewCommentbyArticleId(username, body, id)]

promises.push(checkExists("articles", "article_id", id))


Promise.all(promises)
.then(([comment])=>{
response.status(201).send({comment})
})
.catch((err)=>{
    console.log(err)
    next(err)
})
}

const deleteCommentByCommentId = (request, response, next) =>{
const id = request.params.comment_id

removeCommentByCommentId(id).then((removedComment)=>{
    response.status(204).send({removedComment})
}).catch((err)=>{
    next(err)
})
}

module.exports = {getAllCommentsByArticleId, postACommentByArticleId, deleteCommentByCommentId}