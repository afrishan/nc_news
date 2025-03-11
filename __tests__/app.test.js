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