# random-ip
generate random ip(v4 or v6) addresses

## why
just playing around with ipv6 and wanted to be able to generate addresses in arbitrary ranges

## how
* depends on @indutny's [node-ip](https://github.com/indutny/node-ip) to parse ip addresses
* uses `Math.random()` to randomly twiddle bits within in the CIDR range you specify

## example
```javascript
var randomip = require('random-ip');

// ipv6
randomip('::', 64)                    // 0:0:0:0:f46c:cde1:a409:d38f
randomip('::', 64, 80)                // 0:0:0:0:9eba:0:0:0
randomip('2001:470:e01::', 48, 64)    // 2001:470:e01:da2f:0:0:0:0

// ipv4
randomip('0.0.0.0', 24)               // 0.0.0.136
randomip('0.0.0.0', 16, 24)           // 0.0.68.0
randomip('192.168.2.0', 24)           // 192.168.2.240
```

## test
`node test`

## npm
`npm install random-ip`

## license
WTFPL
