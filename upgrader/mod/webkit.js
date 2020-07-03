"use strict";
exports.__esModule = true;
var Path = require('path');
var Chalk = require('chalk');
var ChildProcess = require('child_process');
function exec(path) {
    console.log(Chalk.bold.cyan("Starting application..."));
    var command = "nw \"" + path + "\"";
    console.log("  > " + command);
    ChildProcess.exec(command);
}
exports["default"] = {
    exec: exec
};
