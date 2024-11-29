var tape = require('tape');
var randomip = require('../');

tape('ipv6 basic', function(t) {
  t.plan(9);
  
  var ip = randomip('::').split(':');
  t.equal(ip.length, 8, 'address has 8 hextets');
  for (var part in ip) {
    part = parseInt(ip[part], 16);
    t.ok(part >= 0 && part <= 0xFFFF, 'part (' + part + ') is hextet');
  }
});

tape('ipv6 average', function(t) {
  t.plan(8);
  
  var ip = averageip('::');
  for (var part in ip) {
    part = ip[part];
    t.ok(approx(part, 0x7FFF), 'average value is 32767 +/- 255');
  }
});

tape('ipv6 prefix', function(t) {
  t.plan(5);
  
  var ip = averageip('2001::', 16);
  t.equal(ip[0], 0x2001, 'prefixed bits are untouched');
  t.ok(approx(ip[1], 0x7FFF), 'other bits have changed');
  
  ip = averageip('::', 1);
  t.ok(approx(ip[0], 0x3FFF), 'single bit prefix');
  
  ip = averageip('::', 8);
  t.ok(approx(ip[0], 0x7F, 10), 'eight bit prefix');  // use smaller margin here
  
  ip = averageip('::', 126);
  t.equal(ip[7], 1, '126 bit prefix');
});

tape('ipv6 length', function(t) {
  t.plan(4);
  
  var ip = averageip('::', 24, 40);
  t.equal(ip[0], 0, 'first hextet is untouched');
  t.ok(approx(ip[1], 0x7F, 10), 'second hextet only lower bits have changed');  // use smaller margin here
  t.ok(approx(ip[2], 0x7F80), 'third hextet only higher bits have changed');
  t.equal(ip[3], 0, 'last hextet is untouched');
});

// +/- 255 so we can do fewer samples when averaging
function approx(a, b, margin) {
  var margin = margin || 0xFF;
  return a >= b - margin && a <= b + margin
}

// do many samples
function averageip(address, prefix, length) {
  var samples = 65535;
  var a = [];
  
  for (var i=0; i<samples; i++) {
    var temp = randomip(address, prefix, length);
    temp = temp.split(':');
    for (var n=0; n<temp.length; n++) {
      a[n] = (a[n] || 0) + parseInt(temp[n], 16);
    }
  }
  
  for (var i=0; i<a.length; i++) {
    a[i] = Math.floor(a[i] / samples);
  }
  
  return a;
}
