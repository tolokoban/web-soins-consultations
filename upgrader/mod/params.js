"use strict";
exports.__esModule = true;
var Path = require('path');
exports["default"] = {
    parse: function () {
        if (process.argv.length < 4) {
            console.error("\nThe Upgrader needs two params:\n    1) The path of the application code.\n    2) The URL of the updates.\n");
            process.exit(1);
        }
        var _a = process.argv, path = _a[2], url = _a[3];
        return {
            url: url,
            path: Path.resolve(process.cwd(), path)
        };
    }
};
