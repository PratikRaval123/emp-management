"use strict";

exports["test event"] = require("./event")
exports["test pipe"] = require("./pipe")
exports["test buffer"] = require("./buffer")
exports["test cache"] = require("./cache")
exports["test hub"] = require("./hub")

require("test").run(exports)
