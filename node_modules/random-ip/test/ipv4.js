var tape = require('tape');
var randomip = require('../');

tape('ipv4 basic', function(t) {
  t.plan(5);
  
  var ip = randomip('0.0.0.0').split('.');
  t.equal(ip.length, 4, 'address has four octets');
  for (var part in ip) {
    part = ip[part];
    t.ok(part >= 0 && part <= 255, 'part (' + part + ') is octet');
  }
});

tape('ipv4 average', function(t) {
  t.plan(4);
  
  var ip = averageip('0.0.0.0');
  for (var part in ip) {
    part = ip[part];
    t.ok(approx(part, 127), 'average value is 127 +/- 1');
  }
});

tape('ipv4 prefix', function(t) {
  t.plan(5);
  
  var ip = averageip('123.0.0.0', 8);
  t.equal(ip[0], 123, 'prefixed bits are untouched');
  t.ok(approx(ip[1], 127), 'other bits have changed');
  
  ip = averageip('0.0.0.0', 1);
  t.ok(approx(ip[0], 63), 'single bit prefix');
  
  ip = averageip('0.0.0.0', 4);
  t.equal(ip[0], 7, 'half octet prefix (4 bits)');
  
  ip = averageip('0.0.0.0', 30);
  t.equal(ip[3], 1, '30 bit prefix');
});

tape('ipv4 length', function(t) {
  t.plan(4);
  
  var ip = averageip('0.0.0.0', 12, 20);
  t.equal(ip[0], 0, 'first octet is untouched');
  t.ok(approx(ip[1], 7), 'second octet only lower bits have changed');
  t.ok(approx(ip[2], 120), 'third octet only higher bits have changed');
  t.equal(ip[3], 0, 'last octet is untouched');
});

// +/- 1 so we can do fewer samples when averaging
function approx(a, b) {
  var margin = 1;
  return a >= b - margin && a <= b + margin;
}

// do many samples
function averageip(address, prefix, length) {
  var samples = 65535;
  var a = [];
  
  for (var i=0; i<samples; i++) {
    var temp = randomip(address, prefix, length);
    temp = temp.split('.');
    for (var n=0; n<temp.length; n++) {
      a[n] = (a[n] || 0) + parseInt(temp[n]);
    }
  }
  
  for (var i=0; i<a.length; i++) {
    a[i] = Math.floor(a[i] / samples);
  }
  
  return a;
}
