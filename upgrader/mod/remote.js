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
/**
 * Deals with anything from the update website.
 *
 */
var errors_1 = require("./errors");
var check_sums_1 = require("./check-sums");
var file_system_1 = require("./file-system");
var FS = require('fs');
var Path = require('path');
var Chalk = require('chalk');
var fetch = require('node-fetch');
function fetchText(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var Remote = /** @class */ (function () {
    function Remote(path, localCheckSums, remoteCheckSums) {
        this.path = path;
        this.localCheckSums = localCheckSums;
        this.remoteCheckSums = remoteCheckSums;
        console.log("  > Remote files: " + remoteCheckSums.length);
        console.log("  > Local files: " + localCheckSums.length);
    }
    return Remote;
}());
exports["default"] = {
    /**
     * Given the update website URL, return a promise that resolves
     * in `null` or in a Remote object.
     *
     * `null` means that this URL is not reachable or that `package.txt`
     * does not exist there.
     * In any case, a description of the problem is sent to stderr.
     */
    create: function (path, url) {
        var _this = this;
        console.log(Chalk.bold.cyan("Checking for updates..."));
        console.log("  > " + url);
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var packageUrl, packageTxtContent, remoteCheckSums, localCheckSums, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        packageUrl = url + "/package.txt";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetchText(packageUrl)];
                    case 2:
                        packageTxtContent = _a.sent();
                        remoteCheckSums = check_sums_1["default"].parse(packageTxtContent);
                        return [4 /*yield*/, check_sums_1["default"].loadFromFile(path)];
                    case 3:
                        localCheckSums = _a.sent();
                        resolve(new Remote(path, localCheckSums, remoteCheckSums));
                        return [3 /*break*/, 5];
                    case 4:
                        ex_1 = _a.sent();
                        printFetchError(ex_1, packageUrl);
                        resolve(null);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    },
    execFullDownloadIfNeeded: execFullDownloadIfNeeded
};
/**
 * If there is no "package.txt" in local path, then we need to download everythink.
 */
function execFullDownloadIfNeeded(path, url) {
    return __awaiter(this, void 0, void 0, function () {
        var localCheckSums, packageUrl, remoteCheckSums, packageTxtContent, ex_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(Chalk.bold.cyan("Full download..."));
                    return [4 /*yield*/, check_sums_1["default"].loadFromFile(path)];
                case 1:
                    localCheckSums = _a.sent();
                    if (localCheckSums.length > 0) {
                        console.log("  > No need.");
                        return [2 /*return*/];
                    }
                    packageUrl = url + "/package.txt";
                    remoteCheckSums = [];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetchText(packageUrl)];
                case 3:
                    packageTxtContent = _a.sent();
                    remoteCheckSums = check_sums_1["default"].parse(packageTxtContent);
                    if (remoteCheckSums.length === 0) {
                        console.log(Chalk.red("  > Remote \"package.txt\" is empty!"));
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    ex_2 = _a.sent();
                    printFetchError(ex_2, packageUrl);
                    return [2 /*return*/];
                case 5:
                    console.log("  > Cleaning \"" + path + "\"...");
                    return [4 /*yield*/, cleanPath(path)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, execFullDownload(path, url, remoteCheckSums)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function execFullDownload(path, url, checkSums) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, checkSums_1, checkSum, filename, fileURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, checkSums_1 = checkSums;
                    _a.label = 1;
                case 1:
                    if (!(_i < checkSums_1.length)) return [3 /*break*/, 4];
                    checkSum = checkSums_1[_i];
                    filename = checkSum.path.startsWith("./") ?
                        checkSum.path.substr(2) : checkSum.path;
                    fileURL = url + "/" + filename;
                    console.log("  > Downloading \"" + fileURL + "\"...");
                    return [4 /*yield*/, downloadTo(fileURL, Path.resolve(path, filename))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function downloadTo(url, destinationPath) {
    return __awaiter(this, void 0, void 0, function () {
        var res, buffer, ex_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.buffer()];
                case 2:
                    buffer = _a.sent();
                    return [4 /*yield*/, file_system_1["default"].writeBuffer(destinationPath, buffer)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, true];
                case 4:
                    ex_3 = _a.sent();
                    console.error(ex_3);
                    errors_1["default"].print(ex_3);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function cleanPath(path) {
    return __awaiter(this, void 0, void 0, function () {
        var pathOfFolderToSkip, filesToRemove, foldersToRemove, foldersToVisit, _loop_1, _i, filesToRemove_1, file, _a, foldersToRemove_1, folder;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pathOfFolderToSkip = Path.resolve(path, "data");
                    filesToRemove = [];
                    foldersToRemove = [];
                    foldersToVisit = [path];
                    _loop_1 = function () {
                        var currentFolder, dirInfo;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    currentFolder = foldersToVisit.pop();
                                    if (!currentFolder)
                                        return [2 /*return*/, "continue"];
                                    if (currentFolder !== path) {
                                        foldersToRemove.unshift(currentFolder);
                                    }
                                    return [4 /*yield*/, file_system_1["default"].readDir(currentFolder)];
                                case 1:
                                    dirInfo = _a.sent();
                                    filesToRemove.push.apply(filesToRemove, dirInfo.files.map(function (base) { return Path.resolve(dirInfo.path, base); }));
                                    foldersToVisit.push.apply(foldersToVisit, dirInfo.folders
                                        .map(function (base) { return Path.resolve(dirInfo.path, base); })
                                        .filter(function (path) { return path !== pathOfFolderToSkip; }));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    if (!(foldersToVisit.length > 0)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 3:
                    console.log("    > Deleting " + filesToRemove.length + " file" + (filesToRemove.length > 1 ? "s" : "") + "...");
                    _i = 0, filesToRemove_1 = filesToRemove;
                    _b.label = 4;
                case 4:
                    if (!(_i < filesToRemove_1.length)) return [3 /*break*/, 7];
                    file = filesToRemove_1[_i];
                    console.log("      > " + file);
                    return [4 /*yield*/, file_system_1["default"].deleteFile(file)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    console.log("    > Deleting " + foldersToRemove.length + " folder" + (foldersToRemove.length > 1 ? "s" : "") + "...");
                    _a = 0, foldersToRemove_1 = foldersToRemove;
                    _b.label = 8;
                case 8:
                    if (!(_a < foldersToRemove_1.length)) return [3 /*break*/, 11];
                    folder = foldersToRemove_1[_a];
                    console.log("      > " + folder);
                    return [4 /*yield*/, file_system_1["default"].deleteFolder(folder)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 8];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function printFetchError(ex, url) {
    if (typeof ex.code !== 'string') {
        errors_1["default"].print(ex);
        return;
    }
    switch (ex.code) {
        case "ENOTFOUND":
            return errors_1["default"].print("The network is down or\nthe following URL does not exist:\n            " + url);
        default:
            return errors_1["default"].print(ex);
    }
}
