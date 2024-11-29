"use strict";

var send = require("../send")
var event = require("../event")

var isReduced = require("reducible/is-reduced")
var end = require("reducible/end")

var into = require("reducers/into")
var delay = require("reducers/delay")
var test = require("reducers/test/util/test")
var concat = require("reducers/concat")

exports["test event send"] = test(function(assert) {
  var e = event()

  assert(e, ["hello", "world"], "two values are send to an event")

  send(e, "hello", "a", "b")
  send(e, "world")
  send(e, end)
})

exports["test event miss some sends"] = test(function(assert) {
  var e = event()

  send(e, 1)
  send(e, 2)

  assert(e, [3, 4], "values send after reduction are collected")

  send(e, 3)
  send(e, 4)
  send(e, end)
})

exports["test event early end"] = test(function(assert) {
  var e = event()

  send(e, "hello", "a", "b")
  send(e, "world")
  send(e, end)

  assert(e, {
    values: [],
    error: Error("Event is already reduced")
  }, "event ended bofore it was reduced")
})


exports["test returns reduced after end"] = function(assert) {
  var e = event()

  send(e, 1)
  send(e, end)

  assert.ok(isReduced(send(e, 2)), "ended returns reduced on value")
  assert.ok(isReduced(send(e, end)), "ended returns reduced on end")
}

exports["test can be reduced only once"] = test(function(assert) {
  var e = event()
  var actual = into(e)
  var errored = into(e)

  send(e, 1)
  send(e, 2)
  send(e, end)

  assert.deepEqual(into(e), Error("Event is already reduced"),
                   "read after end errors")

  assert(concat(actual, errored), {
    values: [1, 2],
    error: Error("Event is already reduced")
  }, "send vales were accumulated")
})

exports["test concat with event"] = test(function(assert) {
  var left = event()
  var right = event()

  var actual = concat(left, [ 4, 5, 6 ], right)

  send(left, 1)
  send(right, 7)

  assert(actual, [2, 3, 4, 5, 6, 9], "concatinates lazily")

  send(left, 2)
  send(right, 8)
  send(left, 3)
  send(left, end)
  send(right, 9)
  send(right, end)
})

exports["test errors"] = test(function(assert) {
  var e = event()
  var actual = delay(e)

  assert(actual, {
    values: [1, 2],
    error: Error("boom")
  }, "only values before error are delivered")


  send(e, 1)
  send(e, 2)
  send(e, Error("boom"))

  assert.ok(isReduced(send(e, 3)), "errored returns reduced")
  assert.ok(isReduced(send(e, end)), "errored returns reduced")
})

if (require.main === module)
  require("test").run(exports)
