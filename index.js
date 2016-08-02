const RSMQ = require('rsmq')

/*
 * Message Queue Wrapper -
 * Manages connection status, sends messages to the queue and
 * respects message signatures that should be deferred until
 * a later time (specified in config)
 */
module.exports = function Queue (opts) {
  // instantiate message queue
  const rsmq = new RSMQ({
    host: opts.host,
    port: opts.port
  })
  
  // initialise connection state
  var connected = null
  rsmq.on('connect', () => connected = true)
  rsmq.on('disconnect', () => connected = false)
  
  // do request, fail or wait
  function request (req, err) {
    if (connected === true) return req()
    if (connected === false) return err()

    rsmq.on('connect', connect)
    rsmq.on('disconnect', disconnect)
    
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
  }
  
  // public send function
  this.send = function (message, done) {
    function send () {
      var options = {
        qname: opts.name,
        message: message,
        delay: getDelay(message)
      }
      rsmq.sendMessage(options, done)
    }

    function error () {
      done(new Error('Queue server connection refused'))
    }

    request(send, error)
  }

  // determine message delay (or 0)
  function getDelay (message) {
    return isDeferred(message)
      ? untilStart() / 1000
      : 0
  }

  // is message signature in deferred list?
  function isDeferred (message) {
    if (!opts.deferred) return false
    return opts.deferred.messages.some((value) => {
      return message.startsWith(value)
    })
  }
  
  // how long until deferred message window?
  function untilStart () {
    var now = new Date()
    var start = parseTime(opts.deferred.start)
    var stop = parseTime(opts.deferred.stop)
    
    if (now >= start) { // in or later than window
      if (now < stop || stop < start) return 0 // in window or rollover
      return 24 * 60 * 60 * 1000 - (now - start) // later than window
    }
    if (now < start) { // in or before window
      if (now < stop && stop < start) return 0 // in window or rollover
      return start - now // earlier than window
    }
  }
  
  // parse time string from config file
  function parseTime (string) {
    var time = new Date()
    var [hrs, mins] = string.split(':')
    time.setUTCHours(hrs, mins)
    return time
  }
    
  return this
}
