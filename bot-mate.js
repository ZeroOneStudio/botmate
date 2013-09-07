/*jslint node: true*/
"use strict";
var phantom = require('phantom'),
    http = require('http'),
    url = require('url');

http.createServer(function (req, res) {
    var query, targetUrl;
    query = url.parse(req.url, true).query;
    if (typeof query === 'object' && query.host !== undefined && query.fragment !== undefined) {
        targetUrl = "http://" + query.host + "/#!" + query.fragment;
        console.log('Processing url:', targetUrl);
        phantom.create(function (ph) {
            ph.createPage(function (page) {
                page.set('onLoadFinished', function (status) {
                    if (status !== 'success') {
                        res.writeHead(500, {'Content-Type': 'text/html'});
                        res.end("Couldn't open desired page\n", 'utf-8');
                        console.log('Error occured with url:', targetUrl);
                    } else {
                        page.get('content', function (content) {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.end(content, 'utf-8');
                            console.log('Served static version of:', targetUrl);
                        });
                    }
                    ph.exit();
                });
                page.open(targetUrl);
            });
        });
    }
}).listen(3001, '127.0.0.1');
console.log("Proxy listening at http://127.0.0.1:3001");