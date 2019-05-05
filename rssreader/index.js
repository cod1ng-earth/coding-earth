module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Content-Type', 'application/json')

  const response = {
    message: 'micro says hello'
  };

  res.end(JSON.stringify(response, null, 4))
}