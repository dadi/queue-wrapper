# DADI Queue Wrapper

A high-level library for interacting with [DADI Queue](https://github.com/dadi/queue)

## Overview

DADI Queue is a lightweight, high-performance task queue.

This library provides a simple wrapper for connecting and sending messages to the queue.

## Getting started

1. Install the **@dadi/queue-wrapper** module to your project:

   `npm install @dadi/queue-wrapper --save`

2. Add the library and configure the options:

   ```javascript
   var Queue = require('@dadi/queue-wrapper')
   var queue = Queue({
     host: '127.0.0.1',
     port: 6379,
     name: 'myqueue'
   })
   ```

3. Send a message:

   ```javascript
   queue.send('hello-world', function (err, resp) {
     if (err) console.log('oh no')
   })
   ```

### Deferring messages

```javascript
var queue = Queue({
  ...
  deferred: {
    messages: ['foo', 'bar:baz'],
    start: '20:00',
    stop: '02:00'
  }
})
```

The options above will ensure that the queue will only begin processing messages starting with 'foo' and 'bar:baz' between 20:00 and 02:00 every day.

## License

DADI is a data centric development and delivery stack, built specifically in support of the principles of API first and COPE.

Copyright notice
(C) 2016 DADI+ Limited <support@dadi.tech>
All rights reserved

This product is part of DADI.<br />
DADI is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version ("the AGPL").

**If you wish to use DADI outside the scope of the AGPL, please
contact us at info@dadi.co for details of alternative licence
arrangements.**

**This product may be distributed alongside other components
available under different licences (which may not be AGPL). See
those components themselves, or the documentation accompanying
them, to determine what licences are applicable.**

DADI is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

The GNU Affero General Public License (AGPL) is available at
http://www.gnu.org/licenses/agpl-3.0.en.html.<br />
A copy can be found in the file AGPL.md distributed with
these files.

This copyright notice MUST APPEAR in all copies of the product!
