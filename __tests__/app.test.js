const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data")
const db = require("../db/connection")
const request = require("supertest")
const app = require("../app")


beforeEach(()=>{
return seed(data)
})

afterAll(()=>{
return db.end()
})

describe("/api/notAPath", () => {
  test("ANY 404: responds with error message when path is not found", () => {
    return request(app)
      .get("/api/treasure")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of correctly formatted topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
      expect(body.topics.length).toBe(3);
      body.topics.forEach((topic)=>{
        expect(topic).toHaveProperty("slug")
        expect(topic).toHaveProperty("description")
      })
      });
  });

});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object containing information of the article that has the requested id", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({body}) => {
       
        const article = body.article
        const expectedOutput = { 
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
           article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 11
        }

        expect(article).toMatchObject(expectedOutput)
      })
      
  });
  test("GET 400: responds with bad request", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
    })
    test("GET 404: responds with 'not found' ", () => {
      return request(app)
        .get("/api/articles/900")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
      })
    })
    describe("GET /api/articles", () =>{
      test("200: Responds with an array of all article objects",()=>{
        return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then(({body})=>{
          const articles = body.articles
          expect(articles.length).toBe(13)
          expect(articles).toBeSortedBy('created_at', {
            descending: true,
          });

          articles.forEach((article)=>{
            expect(article).toHaveProperty("author")
            expect(article).toHaveProperty("title")
            expect(article).toHaveProperty("article_id")
            expect(article).toHaveProperty("topic")
            expect(article).not.toHaveProperty("body")
            expect(article).toHaveProperty("created_at")
            expect(article).toHaveProperty("votes")
            expect(article).toHaveProperty("article_img_url")
            expect(article).toHaveProperty("comment_count")
          })
        })
      })
      test("200: Responds with an array of articles sorted by any valid coloumn and ordered", ()=>{
        return request(app)
        .get(`/api/articles?sort_by=title&order=asc`)
        .expect(200)
        .then(({body})=>{
          const articles = body.articles
          expect(articles.length).toBe(13)
          expect(articles).toBeSortedBy('title', {
            descending: false,
          });
        })
    
      })
      test("GET 400: responds with bad request when sort_by parameter input doesn't exist", () => {
        return request(app)
          .get("/api/articles?sort_by=DROP_TABLE_IF_EXISTS")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          });
      });
      test("GET 400: responds with bad request when order parameter input doesn't exist", () => {
        return request(app)
          .get("/api/articles?order=pink")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          });
      });
      test("200: Responds with an array of articles that have the given topic", ()=>{
        return request(app)
        .get(`/api/articles?topic=cats`)
        .expect(200)
        .then(({body})=>{
          const articles = body.articles
          expect(articles.length).toBe(1)
          articles.forEach((article)=>{
            expect(article.topic).toBe("cats")
          })
        })
      })
      test("GET 404: responds with not found when topic value doesn't exist in the data", () => {
        return request(app)
          .get("/api/articles?topic=boo")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("not found");
          });
      });
    })

    describe("PATCH /api/articles/:article_id", ()=>{
      test("200: Responds with an updated vote count on the article object at the given article_id", ()=>{ return request(app)
        .patch("/api/articles/5")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({body})=>{
          const article = body.article
          expect(article.author).toBe("rogersop")
          expect(article.title).toBe("UNCOVERED: catspiracy to bring down democracy")
          expect(article.topic).toBe("cats")
          expect(article.created_at).toBe("2020-08-03T13:14:00.000Z")
          expect(article.body).toBe("Bastet walks amongst us, and the cats are taking arms!")
          expect(article.votes).toBe(2)
          expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")

        })
      })
      test("200: Responds with an updated vote count on the article object at the given article_id", ()=>{ return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -80 })
        .expect(200)
        .then(({body})=>{
          const article = body.article
          expect(article.author).toBe("butter_bridge")
          expect(article.title).toBe("Living in the shadow of a great man")
          expect(article.topic).toBe("mitch")
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
          expect(article.body).toBe("I find this existence challenging")
          expect(article.votes).toBe(20)
          expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")

        })
      })
      test("PATCH 404: responds with 'not found' when the article_id is not in the database ", () => {
        return request(app)
          .patch("/api/articles/900")
          .send({inc_votes: 4})
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("not found");
          });
        })
        test("PATCH 400: responds with 'bad request' when the article_id is invalid ", () => {
          return request(app)
            .patch("/api/articles/NotANumber")
            .send({inc_votes: 2 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("bad request");
            });
          })
      test("PATCH 400: responds with bad request when the response body doesn't contain the correct field of inc_votes ", () => {
        return request(app)
        .patch(`/api/articles/5`)
        .send({ vote: 2 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          })
      })
      test("PATCH 400: responds with bad request when the value field in the response body doesn't have the right format ", () => {
        return request(app)
        .patch(`/api/articles/5`)
        .send({ vote: "two" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          })
      })
    })

    describe(" GET /api/articles/:article_id/comments", ()=>{
      test("200: Responds with an array of comments for the given article_id",()=>{
        return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({body})=>{
          const comments = body.comments

          expect(comments.length).toBe(11)
          comments.forEach((comment)=>{
            expect(comment).toHaveProperty("comment_id")
            expect(typeof comment.comment_id).toBe("number")
            expect(comment).toHaveProperty("votes")
            expect(typeof comment.votes).toBe("number")
            expect(comment).toHaveProperty("created_at")
            expect(typeof comment.created_at).toBe("string")
            expect(comment).toHaveProperty("author")
            expect(typeof comment.author).toBe("string")
            expect(comment).toHaveProperty("body")
            expect(typeof comment.body).toBe("string")
            expect(comment).toHaveProperty("article_id")
            expect(typeof comment.article_id).toBe("number")
          })
        })
      })
      test("GET 400: responds with bad request when the given article_id is invalid type", () => {
        return request(app)
          .get("/api/articles/notanumber/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          })
      })
      test("GET 404: responds with 'not found' when the article_id is valid type but not in the database ", () => {
        return request(app)
          .get("/api/articles/900/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("not found");
          });
        })
    })

    describe("POST /api/articles/:article_id/comments", ()=>{
      test("201: Responds with the new comment that was posted on the article with the input article_id ",()=>{
        return request(app)
        .post(`/api/articles/2/comments`)
        .send({username: "butter_bridge", body: "Great read, but i do have a few points..."})
        .expect(201)
        .then(({body})=>{
          const comment = body.comment
          expect(comment.comment_id).toBe(19)
          expect(comment.author).toBe("butter_bridge")
          expect(comment.body).toBe("Great read, but i do have a few points...")
          expect(comment.article_id).toBe(2)
          expect(comment).toHaveProperty("created_at")
          expect(comment.votes).toBe(0)

        })
      })
      test("POST 400: responds with bad request article_id is invalid ", () => {
        return request(app)
        .post(`/api/articles/notANumber/comments`)
        .send({username: "butter_bridge", body: "Great read, but i do have a few points..."})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          })
      })
      test("POST 400: responds with bad request when the response body doesn't contain the correct fields of username and body ", () => {
        return request(app)
        .post(`/api/articles/2/comments`)
        .send({name: "butter_bridge", title: "Great read, but i do have a few points..."})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          })
      })
    })

    describe("DELETE /api/comments/:comment_id", ()=>{
      test("204: Deletes the comment at the given comment_id and responds with no content", ()=>{
        return request(app)
        .delete("/api/comments/1")
        .expect(204, "")
      })
      test("DELETE 404: responds with 'not found' when the comment_id is not in the database ", () => {
        return request(app)
          .delete("/api/comments/895")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("not found");
          });
        })
        test("DELETE 400: responds with bad request comment_id is invalid ", () => {
          return request(app)
          .delete(`/api/comments/notANumber`)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("bad request");
            })
        })
    })
    describe("GET /api/users", ()=>{
      test("200: Responds with an array of user objects", ()=>{
        return request(app)
        .get(`/api/users`)
        .expect(200)
        .then(({body})=>{
          expect(body.users.length).toBe(4)
          body.users.forEach((user)=>{
            expect(typeof user.username).toBe("string")
            expect(typeof user.name).toBe("string")
            expect(typeof user.avatar_url).toBe("string")
          })
        })
      })
    })