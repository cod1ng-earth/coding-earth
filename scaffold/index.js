const Static = require('node-static');
const platformsh = require("platformsh").config();

const file = new Static.Server('./build');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(platformsh.port);