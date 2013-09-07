var spawn = require('child_process').spawn,
    http = require('http'),
    url = require('url');

http.createServer(function (req, res) {
    var child, query, targetUrl, 
        staticContent = [];
    query = url.parse(req.url,true).query;
    if (typeof query == 'object' && typeof query['host'] !== 'undefined' && typeof query['fragment'] !== 'undefined') {
        targetUrl = "http://" + query['host'] + "/#!" + query['fragment'];
        console.log('Processing url:', targetUrl);
        child = spawn("phantomjs", ['page-content.js', targetUrl]);
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function (data) {
            staticContent.push(data);
        });
        child.on('close', function (code) {
            if (code === 0) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(staticContent.join(), 'utf-8');
                console.log('Served static version of:', targetUrl);
            } else {
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end("Botmate internat error\n", 'utf-8');
                console.log('Error occured with url:', targetUrl);
            }
        });
    }
}).listen(3001, '127.0.0.1');
console.log("Proxy listening at http://127.0.0.1:3001");