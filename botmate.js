#! /usr/local/bin/node

var forever = require('forever'),
child;

child = forever.start('core.js', {
    max: 3
});

child.on('exit', function () {
    console.log('bot-mate has exited after 3 restarts.');
});