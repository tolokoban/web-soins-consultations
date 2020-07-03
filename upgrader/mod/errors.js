"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Chalk = require('chalk');
exports["default"] = {
    print: print
};
function print(message) {
    var strMessage = typeof message === 'string' ?
        message : JSON.stringify(message, null, '  ');
    var lines = strMessage.split("\n");
    var maxLength = 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        maxLength = Math.max(maxLength, line.length);
    }
    var separator = "+-" + repeat('-', maxLength) + "-+";
    var output = __spreadArrays([
        separator
    ], lines.map(function (line) { return "| " + line + repeat(' ', maxLength - line.length) + " |"; }), [
        separator
    ]);
    console.log(Chalk.bgRed.white(output.join("\n")));
}
function repeat(char, times) {
    var output = '';
    while (times-- > 0)
        output = "" + output + char;
    return output;
}
