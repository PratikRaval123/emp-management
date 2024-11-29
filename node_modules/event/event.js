"use strict";

var send = require("./send")
var reduce = require("reducible/reduce")
var isReduced = require("reducible/is-reduced")
var isError = require("reducible/is-error")
var reduced = require("reducible/reduced")
var end = require("reducible/end")

// `Event` is data type representing a stream of values that can be dispatched
// manually in an imperative style by calling `send(event, value)`
function Event() {}

// `Event` type has internal property of for aggregating `watchers`. This
// property has a unique name and is intentionally made non-enumerable (in
// a future it will be a private names
// http://wiki.ecmascript.org/doku.php?id=harmony:private_name_objects) so
// that it's behavior can not be tempered.
var reducer = "watchers@" + module.id
var state = "state@" + module.id
var ended = "ended@" + module.id
Object.defineProperty(Event.prototype, state, {
  value: void(0), enumerable: false, configurable: false, writable: true
})
Object.defineProperty(Event.prototype, reducer, {
  value: void(0), enumerable: false, configurable: false, writable: true
})
Object.defineProperty(Event.prototype, ended, {
  value: false, enumerable: false, configurable: false, writable: true
})



// ## send
//
// `Event` type implements `send` as a primary mechanism for dispatching new
//  values of the given `event`. All of the `watchers` of the `event` will
//  be invoked in FIFO order. Any new `watchers` added in side effect to this
//  call will not be invoked until next `send`. Note at this point `send` will
//  return `false` if no watchers have being invoked and will return `true`
//  otherwise, although this implementation detail is not guaranteed and may
//  change in a future.
send.define(Event, function sendEvent(event, value) {
  // Event may only be reduced by one consumer function.
  // Other data types built on top of signal may allow for more consumers.
  if (event[ended]) return reduced()
  if (value === end || isError(value)) event[ended] = true

  var next = event[reducer]
  if (next) {
    var result = next(value, event[state])
    if (isReduced(result) || event[ended])
      event[reducer] = event[state] = void(0)
    else event[state] = result
  }
})

reduce.define(Event, function(event, next, initial) {
  // Event may only be reduced by one consumer function.
  // Other data types built on top of signal may allow for more consumers.
  if (event[reducer] || event[ended])
    return next(Error("Event is already reduced"), initial)
  event[reducer] = next
  event[state] = initial
})

function event() {
  /**
  Function creates new `Event` that can be `watched` for a new values `send`-ed
  on it. Also `send` function can be used on returned instance to send new
  values.

  ## Example

      var e = event()

      send(e, 0)

      reduce(e, function(index, value) {
        console.log("=>", index, value)
        return index + 1
      }, 0)

      send(e, "a") // => 0 "a"
      send(e, "b") // => 0 "b"
  **/
  return new Event()
}
event.type = Event

module.exports = event
