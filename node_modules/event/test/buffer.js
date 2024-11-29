"use strict";

var test = require("reducers/test/util/test")
var lazy = require("reducers/test/util/lazy")

var event = require("../event")
var send = require("../send")

var end = require("reducible/end")

var buffer = require("buffer-reduce")

var fold = require("reducers/fold")
var into = require("reducers/into")
var concat = require("reducers/concat")

exports["test signal bufferring"] = test(function(assert) {
  var called = 0
  var e = event()
  var source = concat(lazy(function() {
                        called = called + 1
                        return 0
                      }),
                      e)
  var b = buffer(source)


  assert.equal(called, 1, "buffer is greedy")

  send(e, 1)
  send(e, 2)

  var p = fold(b, function(value, result) {
    result.push(value)
    return result
  }, [])

  send(e, 3)
  send(e, end)

  assert.deepEqual(into(b), [ 0, 1, 2, 3 ], "event values are buffered")
  assert.deepEqual(into(b), [ 0, 1, 2, 3 ], "buffers only once")

  assert.equal(1, called, "source was buffered")

  assert(b, [ 0, 1, 2, 3 ], "all values are send")
})

if (require.main === module)
  require("test").run(exports)
