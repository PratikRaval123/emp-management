"use strict";

var test = require("reducers/test/util/test")

var event = require("../event")
var send = require("../send")

var end = require("reducible/end")
var into = require("reducers/into")

var cache = require("cache-reduce")

exports["test signal cacheing"] = test(function(assert) {
  var e = event()
  var c = cache(e)
  var value = into(c)


  send(e, 1)
  send(e, 2)
  send(e, 3)
  send(e, 4)
  send(e, end)

  assert.deepEqual(into(c), [ 1, 2, 3, 4 ], "event values are cached")

  assert(value, [ 1, 2, 3, 4 ], "all values are send")
})

if (require.main === module)
  require("test").run(exports)
