#! /usr/local/bin/node

var forever = require('forever'),
option      = process.argv[2], // start or stop
child;

if (option === 'start') {
    child = forever.start('botmate.js', {
        max: 3
    });

    child.on('exit', function () {
        console.log('bot-mate has exited after 3 restarts.');
    });
}
else if(option === 'stop') {
    forever.stopAll();
    forever.cleanUp();
}
else {
    console.log('ERROR: invalid botmate command. botmate accepts start or stop.');
}