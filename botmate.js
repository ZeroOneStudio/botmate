"use strict";
var phantom = require('phantom'),
    http = require('http'),
    url = require('url'),
    moment = require('moment'),
    logger = require('./lib/logger');

phantom.create(function (ph) {
    http.createServer(function (req, res) {
        var query, targetUrl,
            reqMoment = moment();
        query = url.parse(req.url, true).query;
        if (query.host === undefined && query.fragment === undefined) {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end("Something is wrong with request arguments. Please read documentation of Botmate.\n", 'utf-8');
            return logger.perform('wrong-args', undefined, req);
        }
        targetUrl = "http://" + query.host + "#!" + query.fragment;
        logger.perform('processing', targetUrl, req);
        ph.createPage(function (page) {
            page.set('onLoadFinished', function (status) {
                if (status !== 'success') {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end("Couldn't open desired page\n", 'utf-8');
                    logger.perform('request-error', targetUrl, req);
                    return page.close();
                }
                page.get('content', function (content) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content, 'utf-8');
                    logger.perform('success', targetUrl, req, reqMoment);
                    return page.close();
                });
            });
            page.open(targetUrl);
        });
    }).listen(3001, '127.0.0.1');
});

console.log("Proxy listening at http://127.0.0.1:3001");