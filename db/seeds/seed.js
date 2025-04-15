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



  ; //<< write your first query in here.
};
module.exports = seed;
