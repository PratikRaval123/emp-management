var ip = require('ip');

module.exports = randomip;

function randomip(address, start, end) {
  var bytes = ip.toBuffer(address);
  var ipv6 = bytes.length === 16;
  var bytesize = 8;

  start = start || 0;
  end = typeof end !== 'undefined' ? end : bytes.length * bytesize;

  for (var i = 0; i < bytes.length; i++) {
    var bit = i * bytesize;

    // skip if nothing to do
    if (bit + bytesize < start || bit >= end) {
      continue;
    }

    var b = bytes[i];

    // insert random bits
    for (var n = 0; n < bytesize; n++) {
      if (bit >= start && bit < end) {
        var bitpos = bytesize - n - 1;
        var bitmask = 1 << bitpos;
        if (Math.random() < 0.5) {
          b |= bitmask;
        }
        else {
          b &= ~(bitmask);
        }
      }
      bit++;
    }

    // save randomized byte
    bytes[i] = b;
  }

  // need an array for formatting
  var tets = [];
  for (var i = 0; i < bytes.length; i++) {
    if (ipv6) {
      if (i % 2 === 0) {
        tets[i >> 1] = (bytes[i] << bytesize | bytes[i + 1]).toString(16);
      }
    }
    else {
      tets[i] = bytes[i];
    }
  }

  return tets.join(ipv6 ? ':' : '.');
}
