// Load the http module to create an http server.
var http = require('http');

// Load the Platform.sh configuration.
const config = require("platformsh-config").config();
let PORT;

if (!config.isValidPlatform()) {
  PORT=process.env.PORT || 3000
} else {
  PORT=config.port;
}

var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.end("<html><head><title>Hello node</title></head><body><h1><img src='public/js.png'>Hello Node</h1><h3>Platform configuration:</h3><pre>"+JSON.stringify(config, null, 4) + "</pre></body></html>");
});

server.listen(PORT, () => {
  console.log(`started on ${PORT}`)
});