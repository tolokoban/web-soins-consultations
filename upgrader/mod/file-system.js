"use strict";
exports.__esModule = true;
var errors_1 = require("./errors");
var mkdirp_1 = require("./mkdirp");
var FS = require('fs');
var Path = require('path');
var Chalk = require('chalk');
exports["default"] = {
    deleteFile: deleteFile,
    deleteFolder: deleteFolder,
    readDir: readDir,
    writeBuffer: writeBuffer
};
function readDir(path) {
    return new Promise(function (resolve) {
        FS.readdir(path, { withFileTypes: true }, function (err, entries) {
            var result = {
                path: path,
                files: [],
                folders: []
            };
            if (err) {
                errors_1["default"].print(err);
            }
            else {
                result.files = entries
                    .filter(function (entry) { return entry.isFile(); })
                    .map(function (entry) { return entry.name; });
                result.folders = entries
                    .filter(function (entry) { return entry.isDirectory(); })
                    .map(function (entry) { return entry.name; });
            }
            resolve(result);
        });
    });
}
function deleteFile(path) {
    return new Promise(function (resolve) {
        FS.unlink(path, function (err) {
            if (err) {
                console.log(Chalk.bold.red("Unable to delete this file:"), Chalk.red(path));
                console.log(err);
            }
            resolve(path);
        });
    });
}
function deleteFolder(path) {
    return new Promise(function (resolve) {
        FS.rmdir(path, { maxRetries: 3 }, function (err) {
            if (err) {
                console.log(Chalk.bold.red("Unable to delete this file:"), Chalk.red(path));
                console.log(err);
            }
            resolve(path);
        });
    });
}
function writeBuffer(path, buffer) {
    return new Promise(function (resolve, reject) {
        var dirname = Path.dirname(path);
        mkdirp_1["default"](dirname, function (err) {
            if (err)
                reject(err);
            FS.writeFileSync(path, buffer);
            resolve();
        });
    });
}
