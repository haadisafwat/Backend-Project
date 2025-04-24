const db = require("../../db/connection");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

const formatComments = (articlesData) => {
  if (articlesData === 0) return {}
  const result = {}
  articlesData.forEach((article) => {
    result[article.title] = article.article_id
  })
  return result
}


module.exports = { convertTimestampToDate, formatComments};



