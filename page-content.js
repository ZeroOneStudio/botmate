/*jslint node: true*/
/*globals phantom*/
"use strict";
var page = require('webpage').create(),
    system = require("system");
page.open(system.args[1], function (status) {
    if (status !== 'success') {
        console.log("Failed to load desired page");
        phantom.exit(1);
    }
    console.log(page.content);
    phantom.exit(0);
});