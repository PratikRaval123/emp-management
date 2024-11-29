"use strict";

var event = require("../event")
var send = require("../send")

var test = require("reducers/test/util/test")
var lazy = require("reducers/test/util/lazy")

var end = require("reducible/end")

var hub = require("reducers/hub")
var map = require("reducers/map")
var into = require("reducers/into")
var take = require("reducers/take")
var concat = require("reducers/concat")

var when = require("eventual/when")


exports["test hub open / close propagate"] = function(assert, done) {
  var called = 0
  var e = event()
  var source = concat(lazy(function() {
                        called = called + 1
                        return 0
                      }),
                      e)
  var h = hub(source)

  assert.equal(called, 0, "event is not open")

  var p = into(h)

  assert.equal(called, 1, "event is open")

  send(e, 1)
  send(e, 2)
  send(e, 3)
  send(e, end)

  when(p, function(actual) {
    assert.deepEqual(actual, [ 0, 1, 2, 3 ], "all value were propagated")
    done()
  })
}

exports["test multiple subscribtion"] = function(assert, done) {
  var c = event()
  var h = hub(c)
  var p1 = into(h)

  var p2 = into(h)


  send(c, 1)

  var p3 = into(h)

  send(c, 2)
  send(c, 3)

  var p4 = into(h)

  send(c, end)

  when(p1, function(actual) {
    assert.deepEqual(actual, [ 1, 2, 3 ], "first consumer get all messages")
    when(p2, function(actual) {
      assert.deepEqual(actual, [ 1, 2, 3],
                       "second consumer get all messages")
      when(p3, function(actual) {
        assert.deepEqual(actual, [ 2, 3 ],
                         "late consumer gets no prior messages")
        when(p4, function(actual) {
          assert.deepEqual(actual, [],
                           "gets no messages if no messages sendd")
          done()
        })
      })
    })
  })
}

exports["test source is closed on end"] = function(assert, done) {
  var c = event()
  var h = hub(c)
  var t = take(h, 2)

  var p = into(t)

  send(c, 1)
  send(c, 2)

  when(p, function(actual) {
    assert.deepEqual(actual, [ 1, 2 ], "value propagated")
    done()
  })
}

exports["test source is closed on last end"] = function(assert, done) {
  var c = event()
  var h = hub(c)
  var t1 = take(h, 1)
  var t2 = take(h, 2)
  var t3 = take(h, 3)

  var p1 = into(t1)

  var p2 = into(t2)

  send(c, 1)

  var p3 = into(t3)

  send(c, 2)
  send(c, 3)
  send(c, 4)
  send(c, end)

  when(p1, function(actual) {
    assert.deepEqual(actual, [ 1 ], "#1 took 1 item")
    when(p2, function(actual) {
      assert.deepEqual(actual, [ 1, 2 ], "#2 took 2 items")
      when(p3, function(actual) {
        assert.deepEqual(actual, [ 2, 3, 4 ], "#3 took 3 items")
        done()
      })
    })
  })
}

exports["test reducing closed"] = function(assert, done) {
  var e = event()
  var h = hub(e)

  var p1 = into(h)

  send(e, 0)
  send(e, end)

  var p2 = into(h)

  when(p1, function(actual) {
    assert.deepEqual(actual, [ 0 ], "only item was collected")
    when(p2, null, function() {
      assert.pass("event erros when reduced after it's ended")
      done()
    })
  })
}


exports["test map hub"] = test(function(assert) {
  var called = 0
  var s = event()
  var h1 = hub(s)
  var m = map(h1, function(x) {
    called = called + 1
    return x
  })
  var h2 = hub(m)

  var actual = concat(into(h2),
                      into(h2),
                      "x",
                      lazy(function() { return called }))

  send(s, 1)
  send(s, 2)
  send(s, 3)
  send(s, end)

  assert(actual, [ 1, 2, 3, 1, 2, 3, "x", 3 ],
         "hub dispatches on consumers")
})

if (require.main === module)
  require("test").run(exports)
