const db = require("../connection")

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



  ; //<< write your first query in here.
};
module.exports = seed;
