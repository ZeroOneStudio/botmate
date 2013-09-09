/*jslint node: true*/
"use strict";
var phantom = require('phantom'),
    http = require('http'),
    url = require('url'),
    colors = require('colors'),
    moment = require('moment');

var Logger = {
    logTimestamp: function () {
        var timestamp = moment().format('D MMM YYYY, H:m');
        return timestamp.blue;
    },
    perform: function (action, targetUrl, req, reqMoment) {
        switch (action) {
        case 'processing':
            console.log(this.logTimestamp(), 'Processing url:'.yellow, targetUrl, 'for ' + req.headers['user-agent'].grey + ' (' + req.headers.host + ')');
            break;
        case 'request-error':
            console.log(this.logTimestamp(), 'Error occured with url:'.red, targetUrl, '(' + req.headers.host + ')');
            break;
        case 'success':
            console.log(this.logTimestamp(), 'Served static version of:'.green, targetUrl, '(' + req.headers.host + ')', 'in', moment().diff(reqMoment, 'milliseconds') + 'ms');
            break;
        case 'wrong-args':
            console.log(this.logTimestamp(), 'Wrong request arguments'.red, 'from ' + req.headers['user-agent'].grey + ' (' + req.headers.host + ')');
            break;
        }
    }
};

phantom.create(function (ph) {
    http.createServer(function (req, res) {
        var query, targetUrl,
            reqMoment = moment();
        query = url.parse(req.url, true).query;
        if (typeof query === 'object' && query.host !== undefined && query.fragment !== undefined) {
            targetUrl = "http://" + query.host + "/#!" + query.fragment;
            Logger.perform('processing', targetUrl, req);
            ph.createPage(function (page) {
                page.set('onLoadFinished', function (status) {
                    if (status !== 'success') {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end("Couldn't open desired page\n", 'utf-8');
                        Logger.perform('request-error', targetUrl, req);
                        page.close();
                    } else {
                        page.get('content', function (content) {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.end(content, 'utf-8');
                            Logger.perform('success', targetUrl, req, reqMoment);
                            page.close();
                        });
                    }
                });
                page.open(targetUrl);
            });
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end("Something is wrong with request arguments. Please read documentation of Botmate.\n", 'utf-8');
            Logger.perform('wrong-args', targetUrl, req);
        }
    }).listen(3001, '127.0.0.1');
});

console.log("Proxy listening at http://127.0.0.1:3001");