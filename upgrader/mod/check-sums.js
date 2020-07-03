"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var errors_1 = require("./errors");
var FS = require('fs');
var Path = require('path');
var Chalk = require('chalk');
var RX_HASH = /^([0-9a-f]+)[ \t]+(.+)$/g;
exports["default"] = {
    findHashFromPath: findHashFromPath,
    findPathFromHash: findPathFromHash,
    loadFromFile: loadFromFile,
    parse: parse
};
/**
 * Given a content made of lines with two columns (sha256, filename),
 * return an array of ICheckSum.
 * If the content has bad syntax, an exception will be thrown.
 */
function parse(content) {
    var checksums = [];
    var lines = content.split("\n").map(function (line) { return line.trim(); });
    var lineNum = 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        lineNum++;
        if (line.trim().length === 0)
            continue;
        RX_HASH.lastIndex = -1;
        var matches = RX_HASH.exec(line);
        if (!matches) {
            throw "Bad hash syntax in \"package.txt\" at line #" + lineNum + ":\n" + line;
        }
        var hash = matches[1], path = matches[2];
        checksums.push({ hash: hash, path: path });
    }
    return checksums;
}
function loadFromFile(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    try {
                        var filename = Path.resolve(path, "package.txt");
                        if (!FS.existsSync(filename)) {
                            console.log(Chalk.red("Path not found: " + filename));
                            return resolve([]);
                        }
                        var content = "" + FS.readFileSync(filename);
                        return resolve(parse(content));
                    }
                    catch (ex) {
                        errors_1["default"].print(ex);
                        return [];
                    }
                })];
        });
    });
}
function findPathFromHash(checksums, hash) {
    for (var _i = 0, checksums_1 = checksums; _i < checksums_1.length; _i++) {
        var checksum = checksums_1[_i];
        if (hash === checksum.hash)
            return checksum.path;
    }
    return null;
}
function findHashFromPath(checksums, path) {
    for (var _i = 0, checksums_2 = checksums; _i < checksums_2.length; _i++) {
        var checksum = checksums_2[_i];
        if (path === checksum.path)
            return checksum.hash;
    }
    return null;
}
