const db = require("../connection")
const format = require("pg-format");
const { articleData, commentData, topicData, userData } = require("../data/test-data");
const { convertTimestampToDate, formatComments } = require("./utils.js");


const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments, articles, users, topics;`)
  .then(() => {
    return db.query(`
      CREATE TABLE topics (
      slug VARCHAR(50) PRIMARY KEY,
      description VARCHAR(255) NOT NULL,
      img_url VARCHAR(1000)
      )
      ;`)
  })
  .then(() => {
    return db.query(`
      CREATE TABLE users (
      username VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(1000)
      )
      ;`)
  })
  .then(() => {
    return db.query(`
      CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic VARCHAR(255) REFERENCES topics(slug),
      author VARCHAR(255) REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      )
      ;`)
  })
  .then(() => {
    return db.query(`
      CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT NOT NULL REFERENCES articles(article_id),
      body TEXT NOT NULL,
      author VARCHAR(255) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0
      )
      ;`)
  })


// Inserting into Tables///////////////////////////////////////////////////////////////


  .then(() => {
    const formattedTopics = topicData.map(({slug, description, img_url}) => [
      slug,
      description,
      img_url
    ])
    const insertTopicsQuery = format(`
      INSERT INTO topics(slug, description, img_url)
      VALUES %L RETURNING *;
      `, formattedTopics)
    
    return db.query(insertTopicsQuery)

  })
  .then(() => {
    const formattedUsers = userData.map(({username, name, avatar_url}) => [
      username,
      name,
      avatar_url
    ])
    const insertUserQuery = format(`
      INSERT INTO users(username, name, avatar_url)
      VALUES %L RETURNING *;
      `, formattedUsers)
    
    return db.query(insertUserQuery)

  })
  .then(() => {
    const formattedArticles = articleData.map((article) => {
      const convertedObj = convertTimestampToDate(article)
      return [
        article.title,
        article.topic,
        article.author,
        article.body,
        convertedObj.created_at,
        article.votes,
        article.article_img_url
      ]})

      const insertArticleQuery = format(`
        INSERT INTO articles(title,
        topic,
        author,
        body,
        created_at,
        votes,
        article_img_url)
        VALUES %L RETURNING *;
        `, formattedArticles);

        // console.log(insertArticleQuery);

    return db.query(insertArticleQuery)
      
  })
  .then((result) => {
    // console.log(result)
    const lookUp = formatComments(result.rows)
    // console.log(lookUp)
    const formattedComments = commentData.map((comment) => {
      const convertedComment= convertTimestampToDate(comment)
      return [
        convertedComment.author,
        lookUp[comment.article_title],
        convertedComment.votes,
        convertedComment.created_at,
        convertedComment.body
      ]
    })
    // console.log(formattedComments)

      const insertCommentsQuery = format(
        `INSERT INTO comments
        (author, article_id, votes, created_at, body)
        VALUES %L RETURNING *;`,
        formattedComments
      )

        // console.log(insertArticleQuery);

    return db.query(insertCommentsQuery)
      
  })
};
module.exports = seed;
