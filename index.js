'use strict'

const RSMQ = require('rsmq')

/*
 * Message Queue Wrapper -
 * Manages connection status, sends messages to the queue and
 * respects message signatures that should be deferred until
 * a later time (specified in config)
 */
let QueueWrapper = function (options) {
  this.options = options

  // initialise queue
  this.rsmq = this.initialiseQueue()

  // initialise connection state
  this.connected = null

  this.rsmq.on('connect', () => {
    this.connected = true
  })

  this.rsmq.on('disconnect', () => {
    this.connected = false
  })
}

// instantiate message queue
QueueWrapper.prototype.initialiseQueue = function () {
  return new RSMQ({
    host: this.options.host,
    port: this.options.port
  })
}

// public send function
QueueWrapper.prototype.send = function (message, done) {
  const send = () => {
    let options = {
      qname: this.options.name,
      message: message,
      delay: this.getDelay(message)
    }

    console.log(options)

    this.rsmq.sendMessage(options, done)
  }

  function error () {
    done(new Error('Queue server connection refused'))
  }

  this.request(send, error)
}

// do request, fail or wait
QueueWrapper.prototype.request = function (req, err) {
  let rsmq = this.rsmq

  if (this.connected === true) {
    return req()
  }

  if (this.connected === false) {
    return err()
  }

  function connect () {
    req()
    removeListeners()
  }

  function disconnect () {
    err()
    removeListeners()
  }

  function removeListeners () {
    rsmq.removeListener('connect', connect)
    rsmq.removeListener('disconnect', disconnect)
  }

  this.rsmq.on('connect', connect)
  this.rsmq.on('disconnect', disconnect)
}

// determine message delay (or 0)
QueueWrapper.prototype.getDelay = function (message) {
  return this.isDeferred(message)
    ? this.untilStart() / 1000
    : 0
}

// is message signature in deferred list?
QueueWrapper.prototype.isDeferred = function (message) {
  if (!this.options.deferred) return false

  if (!Array.isArray(this.options.deferred.messages)) return false

  return this.options.deferred.messages.some((value) => {
    return message.startsWith(value)
  })
}

// how long until deferred message window?
QueueWrapper.prototype.untilStart = function () {
  const now = new Date()
  const start = this.parseTime(this.options.deferred.start)
  const stop = this.parseTime(this.options.deferred.stop)

  if (now >= start) { // in or later than window
    if (now < stop || stop < start) return 0 // in window or rollover
    return 24 * 60 * 60 * 1000 - (now - start) // later than window
  }

  if (now < start) { // in or before window
    if (now < stop && stop < start) return 0 // in window or rollover
    return start - now // earlier than window
  }
}

// parse time string from configured options
QueueWrapper.prototype.parseTime = function (string) {
  const time = new Date()
  const timeParts = string.split(':')
  time.setUTCHours(timeParts[0], timeParts[1])
  return time
}

module.exports = QueueWrapper
