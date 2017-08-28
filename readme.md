# DADI Queue Wrapper

A high-level library for interacting with [DADI Queue](https://github.com/dadi/queue)

[![npm (scoped)](https://img.shields.io/npm/v/@dadi/queue-wrapper.svg?maxAge=10800&style=flat-square)](https://www.npmjs.com/package/@dadi/queue-wrapper)
[![coverage](https://img.shields.io/badge/coverage-68%25-yellow.svg?style=flat?style=flat-square)](https://github.com/dadi/queue-wrapper)
[![Build Status](https://travis-ci.org/dadi/queue-wrapper.svg?branch=master)](https://travis-ci.org/dadi/queue-wrapper)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

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
