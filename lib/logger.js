/*jslint node: true*/
/* global exports */
"use strict";

var moment = require('moment'),
    colors = require('colors');

function logTimestamp() {
    var timestamp = moment().format('D MMM YYYY, H:mm:ss');
    return timestamp.blue;
}

function compose(action, targetUrl, req, reqMoment) {
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
}

exports.perform = function () {
    var record = [];
    record.push(logTimestamp());
    record = record.concat(compose.apply(this, arguments));
    console.log.apply(console, record);
    return record.join('');
};