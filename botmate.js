/*jslint node: true*/
"use strict";
var forever = require('forever'),
    child;

child = forever.startDaemon('core.js', {
    max: 3
});

child.on('exit', function () {
    console.log('bot-mate has exited after 3 restarts.');
});