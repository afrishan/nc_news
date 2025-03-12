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
        expect(body.msg).toBe("path not found");
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
      
      const {author,
        title,
        article_id,
        topic,

        created_at,
        votes,
        article_img_url} = body.article;
       
        expect(title).toBe("Living in the shadow of a great man")
        expect(topic).toBe("mitch")
        expect(article_id).toEqual(1)
        expect(author).toBe("butter_bridge")
        expect(body.article.body).toBe("I find this existence challenging")
        expect(created_at).toBe("2020-07-09T20:11:00.000Z")
        expect(votes).toBe(100)
        expect(article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
      
      });
      
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
    })