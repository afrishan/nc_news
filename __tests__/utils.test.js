const {
  convertTimestampToDate,
  formatTopicsData,
  searchArticles,
  formatComments, 
  formatArticlesData, 
  formatCommentsData,
  formatUsersData
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("Tests for searchArticles ", () => {
  test("Returns an empty object when passed an empty array", () => {
    const input = []
   
    expect(searchArticles(input)).toEqual({})
  })
  test("Returns an object with the article title and id as a key value pair when passed an array with information about 1 article", () => {
    const input = [
      {article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }]
    expect(searchArticles(input)).toEqual({ "Living in the shadow of a great man": 1 })
  })
  test("Returns an object with multiple park names and ids as key value pairs when passed an array with information about multiple parks", () => {
    const input = [
      {article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1602828180000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }]
    expect(searchArticles(input)).toEqual({ "Living in the shadow of a great man": 1, "Sony Vaio; or, The Laptop": 2})
  })
})

describe('formatComments', () => {
  test("Returns an array when passed an array", ()=>{
    const input = []
    const articles = [{
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1594329060000,
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }]
    const result = formatComments(input, articles)
    expect(result).toBeInstanceOf(Array)
    })
test("mutation test", ()=>{
const input = []
const articles = [{
  article_id: 1,
  title: "Living in the shadow of a great man",
  topic: "mitch",
  author: "butter_bridge",
  body: "I find this existence challenging",
  created_at: 1594329060000,
  votes: 100,
  article_img_url:
    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
}]
const result = formatComments(input, articles)
expect(result).not.toBe(input)
})
  test("When passed an array of one object, Returns an array of  one object with title swapped with article_id", () => {
    const commentsData = [{
    article_title: "Living in the shadow of a great man",
    body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
    votes: 14,
    author: "butter_bridge",
    created_at: 1604113380000}];
    const articles = [{
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1594329060000,
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }]
    const result = formatComments(commentsData, articles);
    expect(result).toEqual([{
      article_id: 1,
      body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
      votes: 14,
      author: "butter_bridge",
      created_at: 1604113380000}])
})
test('When passed an array of objects, Returns an array of objects with title swapped with article_id', () => {

  const commentsData = [{
  article_title: "Living in the shadow of a great man",
  body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
  votes: 14,
  author: "butter_bridge",
  created_at: 1604113380000}, 
  {
    article_title: "They're not exactly dogs, are they?",
    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    votes: 16,
    author: "butter_bridge",
    created_at: 1586179020000,
  } 
];
  const articles = [
    {article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1594329060000,
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {article_id: 2,
      title: "They're not exactly dogs, are they?",
      topic: "mitch",
      author: "butter_bridge",
      body: "Well? Think about it.",
      created_at: 1591438200000,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }]
  
  const result = formatComments(commentsData, articles);
  
  expect(result).toEqual([{
    article_id: 1,
    body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
    votes: 14,
    author: "butter_bridge",
    created_at: 1604113380000},
    {
      article_id: 2,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000}
  ])
})
})


describe("mapping functions", ()=>{
  test("formatTopicsData", ()=>{
    const input = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
        img_url: ""
      },
      {
        description: 'Not dogs',
        slug: 'cats',
        img_url: ""
      },
      {
        description: 'what books are made of',
        slug: 'paper',
        img_url: ""
      }
    ]
    const expectedOutput  =[
      [ 'mitch', 'The man, the Mitch, the legend', '' ],
      [ 'cats', 'Not dogs', '' ],
      [ 'paper', 'what books are made of', '' ]
    ]
    const result = formatTopicsData(input)
    expect(result).toEqual(expectedOutput)
  })
  test("formatUsersData", ()=>{
    const input = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      }
    ]
    const expectedOutput  =[
      [
        'butter_bridge',
        'jonny',
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
      ],
      [
        'icellusedkars',
        'sam',
        'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
      ]
    ]
    const result = formatUsersData(input)
    expect(result).toEqual(expectedOutput)
  })
  test("formatArticlesData", ()=>{
    const input = [{
      created_at: '2020-11-03T09:12:00.000Z',
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    },
    {
      created_at: '2020-05-06T02:14:00.000Z',
      title: 'Student SUES Mitch!',
      topic: 'mitch',
      author: 'rogersop',
      body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }]
    const expectedOutput  =[
      [
        'Eight pug gifs that remind me of mitch',
        'some gifs',
        'mitch',
        'icellusedkars',
        '2020-11-03T09:12:00.000Z',
        'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      ],
      [
        'Student SUES Mitch!',
        'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        'mitch',
        'rogersop',
        '2020-05-06T02:14:00.000Z',
        'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      ]
    ]
    const result = formatArticlesData(input)
    expect(result).toEqual(expectedOutput)
  })
  test("formatCommentsData", ()=>{
    const input = [{
      created_at: '2020-04-06T13:17:00.000Z',
      article_id: 9,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 16,
      author: 'butter_bridge'
    },
    {
      created_at: '2020-10-31T03:03:00.000Z',
      article_id: 1,
      body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      votes: 14,
      author: 'butter_bridge'
    },
    ]
    const expectedOutput  =[
      [
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        16,
        'butter_bridge',
        9,
        '2020-04-06T13:17:00.000Z'
      ],
      [
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        14,
        'butter_bridge',
        1,
        '2020-10-31T03:03:00.000Z'
      ]
    ]
    const result = formatCommentsData(input)
    expect(result).toEqual(expectedOutput)
  })

})
