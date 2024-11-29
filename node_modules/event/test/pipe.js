"use strict";

var pipe = require("../pipe")
var event = require("../event")
var send = require("../send")

var test = require("reducers/test/util/test")
var lazy = require("reducers/test/util/lazy")

var concat = require("reducers/concat")
var into = require("reducers/into")
var delay = require("reducers/delay")
var merge = require("reducers/merge")


var cache = require("cache-reduce")


exports["test pipe multiple streams"] = test(function(assert) {
  var s = event()
  var actual = into(s)
  pipe([1, 2, 3], s)
  pipe([4, 5, 6], s)


  assert(actual, [1, 2, 3],
         "first end causes close on output all subsequent pipes are ignored")
})

exports["test pipe multiple streams indepenently"] = test(function(assert) {
  var s = event()
  var actual = into(s)
  pipe(delay([1, 2, 3]), s)
  pipe(delay([4, 5, 6, 7]), s)

  // note that `6` goes through since `end` is also dispatched with a delay.
  assert(actual, [1, 4, 2, 5, 3, 6],
         "parallel pipe works until first end")
})

exports["test pipe multiple streams"] = test(function(assert) {
  var s = event()
  var actual = into(s)

  pipe(merge([[1, 2, 3], [4, 5], [ 6, 7 ]]), s)

  // note that `6` goes through since `end` is also dispatched with a delay.
  assert(actual, [1, 2, 3, 4, 5, 6, 7],
         "parallel pipe works until first end")
})

if (require.main === module)
  require("test").run(exports)
