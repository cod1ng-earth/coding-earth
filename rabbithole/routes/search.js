const elastic = require("../lib/elasticsearch");
const url = require("url");

module.exports = async (req, res) => {
  const { query } = url.parse(req.url, true);

  const elasticsearchQuery = {
    body: {
      from: 0,
      size: 100,
      query: {
        match_all: {}
      }
    }
  };

  elasticsearchQuery.index = "carrots";

  try {
    const result = await elastic.search(elasticsearchQuery);

    result.body.hits.hits.forEach(record => {
      elastic.delete({
        index: "carrots",
        type: "carrot",
        id: record._id
      });
    });

    res.json({
      carrots: result.body.hits.hits
    });
  } catch (e) {
    console.error(e.meta.body.error);
    res.status(500).send({ error: e.meta.body.error });
  }
};
