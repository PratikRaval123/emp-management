"use strict";

var send = require("./send")
var reduce = require("reducible/reduce")

function pipe(input, output) {
  /**
  Takes reducible `input` and pipes it to the `output` (which is anything
  that implements `send`). Note that first `end` or `error`  from the piped
  `input`-s will end an `output` causing subsequent `send`s return `reducers`
  stopping other `input`-s. If you need to `pipe` all values form multiple
  inputs do `pipe(merge(inputs), output)`, that way `output` will close only
  once all inputs end. If you can't merge all the inputs up front you can
  always pipe merged event. That way sending new inputs to that event will
  automatically pipe all it's items.
  **/
  reduce(input, function pipeReducible(value) { send(output, value) })
}

module.exports = pipe
