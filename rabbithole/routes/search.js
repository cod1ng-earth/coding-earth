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
      },
      sort: [{ created_at: { order: "desc" } }]
    }
  };

  elasticsearchQuery.index = "carrot";

  try {
    const result = await elastic.search(elasticsearchQuery);
    res.json({
      tweets: result.body.hits.hits.map(h => h._source)
    });
  } catch (e) {
    console.error(e.meta.body.error);
    res.status(500).send({ error: e.meta.body.error });
  }
};
