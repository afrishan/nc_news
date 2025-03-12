const { retrieveAllCommentsByArticleId } = require("../models/comments.models")

const getAllCommentsByArticleId = (request, response, next)=>{
const id = request.params.article_id

retrieveAllCommentsByArticleId(id).then((comments)=>{
    response.status(200).send({comments})
}).catch((err)=>{
    next(err)
})

}
module.exports = {getAllCommentsByArticleId}