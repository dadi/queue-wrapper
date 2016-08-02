# DADI Queue Wrapper

A high-level library for interacting with DADI Queue

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

## Contributors

## License
