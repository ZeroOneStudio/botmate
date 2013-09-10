/*jslint node: true*/
"use strict";
var phantom = require('phantom'),
    http = require('http'),
    url = require('url'),
    colors = require('colors'),
    moment = require('moment');

var Logger = {
    logTimestamp: function () {
        var timestamp = moment().format('D MMM YYYY, H:mm:ss');
        return timestamp.blue;
    },
    compose: function (action, targetUrl, req, reqMoment) {
        switch (action) {
        case 'processing':
            return ['Processing url'.yellow, targetUrl, 'for', req.headers['user-agent'].grey, '(' + req.headers.host + ')'];
        case 'request-error':
            return ['Error occured with url'.red, targetUrl, '(' + req.headers.host + ')'];
        case 'success':
            return ['Served static version of'.green, targetUrl, '(' + req.headers.host + ')', 'in', moment().diff(reqMoment, 'milliseconds') + 'ms'];
        case 'wrong-args':
            return ['Wrong request arguments'.red, 'from', req.headers['user-agent'].grey, '(' + req.headers.host + ')'];
        }
    },
    perform: function () {
        var record = [];
        record.push(this.logTimestamp());
        record = record.concat(this.compose.apply(this, arguments));
        console.log.apply(console, record);
        return record.join('');
    }
};

phantom.create(function (ph) {
    http.createServer(function (req, res) {
        var query, targetUrl,
            reqMoment = moment();
        query = url.parse(req.url, true).query;
        if (query.host === undefined && query.fragment === undefined) {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end("Something is wrong with request arguments. Please read documentation of Botmate.\n", 'utf-8');
            return Logger.perform('wrong-args', undefined, req);
        }
        targetUrl = "http://" + query.host + "/#!" + query.fragment;
        Logger.perform('processing', targetUrl, req);
        ph.createPage(function (page) {
            page.set('onLoadFinished', function (status) {
                if (status !== 'success') {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end("Couldn't open desired page\n", 'utf-8');
                    Logger.perform('request-error', targetUrl, req);
                    return page.close();
                }
                page.get('content', function (content) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content, 'utf-8');
                    Logger.perform('success', targetUrl, req, reqMoment);
                    return page.close();
                });
            });
            page.open(targetUrl);
        });
    }).listen(3001, '127.0.0.1');
});

console.log("Proxy listening at http://127.0.0.1:3001");