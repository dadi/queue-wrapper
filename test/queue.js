'use strict'

var path = require('path')
var should = require('should')
var sinon = require('sinon')
var util = require('util')
var EventEmitter = require('events')

const QueueWrapper = require(path.join(__dirname, '../index'))

var FakeRsmq = function() {
  this.sendMessage = function(options, callback) {
    callback(options)
  }

  this.removeListener = function(state, fn) {

  }

  this.del = function() {

  }

  this.start = function() {

  }

  this.stop = function() {

  }
}

let fakeRsmq
let queueWrapper

util.inherits(FakeRsmq, EventEmitter)

describe('QueueWrapper', function (done) {
  beforeEach(function(done) {
    fakeRsmq = new FakeRsmq()
    sinon.stub(QueueWrapper.prototype, 'initialiseQueue').returns(fakeRsmq)
    done()
  })

  afterEach(function(done) {
    QueueWrapper.prototype.initialiseQueue.restore()
    done()
  })

  describe('Connect', function () {
    it ('should set connected state when connect is emitted', function (done) {
      queueWrapper = new QueueWrapper({
        name: 'myqueue'
      })

      fakeRsmq.emit('connect', () => {

      })

      queueWrapper.connected.should.eql(true)
      done()
    })

    it ('should set connected state when disconnect is emitted', function (done) {
      queueWrapper = new QueueWrapper({
        name: 'myqueue'
      })

      fakeRsmq.emit('connect', () => {

      })

      queueWrapper.connected.should.eql(true)

      fakeRsmq.emit('disconnect', () => {

      })

      queueWrapper.connected.should.eql(false)

      done()
    })
  })

  describe('Send', function () {
    it ('should prepare options and send message when connected', function (done) {
      queueWrapper = new QueueWrapper({
        name: 'myqueue'
      })

      fakeRsmq.emit('connect', () => {

      })

      // send is faked above, so the response should contain the options
      // created by the queueWrapper to be sent as the message to the real queue
      queueWrapper.send('message', (response) => {
        should.exist(response.qname)
        done()
      })
    })

    it ('should return error when not connected', function (done) {
      queueWrapper = new QueueWrapper({
        name: 'myqueue'
      })

      fakeRsmq.emit('connect', () => {

      })

      queueWrapper.connected = false

      // the response should contain an error
      queueWrapper.send('message', (response) => {
        should.exist(response.name)
        response.name.should.eql('Error')
        done()
      })
    })
  })

  describe('Deferred', function () {
    it ('should return 0 if no message types are deferred', function (done) {
      queueWrapper = new QueueWrapper({})

      queueWrapper.getDelay('message').should.eql(0)
      done()
    })

    it ('should return 0 if message options is not array', function (done) {
      queueWrapper = new QueueWrapper({
        deferred: {

        }
      })

      queueWrapper.getDelay('xxx').should.eql(0)
      done()
    })

    it ('should return 0 if message type is not deferred', function (done) {
      queueWrapper = new QueueWrapper({
        deferred: {
          messages: ['message']
        }
      })

      queueWrapper.getDelay('xxx').should.eql(0)
      done()
    })

    it ('should return > 0 if message type is deferred', function (done) {
      queueWrapper = new QueueWrapper({
        deferred: {
          messages: ['message'],
          start: '02:00',
          stop: '04:00',
        }
      })

      queueWrapper.getDelay('message').should.be.above(0)
      done()
    })
  })
})

  // describe.skip('Worker', function () {
  //   it('should receive additional data passed in the message request', function (done) {
  //     queueHandler = new QueueHandler()
  //
  //     var msg = {
  //       message: 'sms:send-reminder:123456',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     var spy = sinon.spy(Router.prototype, 'getWorkerData')
  //
  //     fakeRsmq.emit('data', msg)
  //
  //     spy.restore()
  //     spy.called.should.eql(true)
  //     var returnValue = spy.firstCall.returnValue
  //     returnValue.should.eql('123456')
  //     done()
  //   })
  // })
  //
  // describe.skip('Queue', function () {
  //   it('should be started by throttle', function(done) {
  //     var msg = {
  //       message: 'XXX',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     var queueHandler = new QueueHandler()
  //
  //     var handlerStub = sinon.stub(QueueHandler.prototype, 'handle', function (err, req, done) {
  //       if (typeof done === 'function') {
  //         req.address = 'hello'
  //         done()
  //       }
  //     })
  //
  //     var spy = sinon.spy(fakeRsmq, 'start')
  //
  //     // change the message count in the throttle
  //     queueHandler.queue.throttle.val = 5
  //
  //     fakeRsmq.emit('data', msg)
  //
  //     spy.restore()
  //     handlerStub.restore()
  //
  //     spy.calledOnce.should.eql(true)
  //     done()
  //   })
  //
  //   it('should be stopped by throttle', function(done) {
  //     var msg = {
  //       message: 'XXX',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     var queueHandler = new QueueHandler()
  //
  //     var handlerStub = sinon.stub(QueueHandler.prototype, 'handle', function (err, req, done) {
  //       if (typeof done === 'function') {
  //         req.address = 'hello'
  //         done()
  //       }
  //     })
  //
  //     var spy = sinon.spy(fakeRsmq, 'stop')
  //
  //     // change the message count in the throttle
  //     queueHandler.queue.throttle.val = 5
  //
  //     fakeRsmq.emit('message', msg, function() {
  //
  //     })
  //
  //     spy.restore()
  //     handlerStub.restore()
  //
  //     spy.calledOnce.should.eql(true)
  //     done()
  //   })
  //
  //   it('should handle error events, passing the error to the QueueHandler', function(done) {
  //     var msg = {
  //       message: 'XXX'
  //     }
  //
  //     var queueHandler = new QueueHandler()
  //     var spy = sinon.spy(QueueHandler.prototype, 'handle')
  //
  //     fakeRsmq.emit('error', 'ERROR', msg)
  //
  //     spy.restore()
  //
  //     spy.calledOnce.should.eql(true)
  //     var arg = spy.firstCall.args[0]
  //     arg.name.should.eql('BrokerError')
  //     arg.error.should.eql('ERROR')
  //
  //     done()
  //   })
  //
  //   it('should handle data events, passing the message to the QueueHandler', function(done) {
  //     var msg = {
  //       message: 'XXX',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     var queueHandler = new QueueHandler()
  //     var spy = sinon.spy(QueueHandler.prototype, 'handle')
  //
  //     fakeRsmq.emit('data', msg)
  //
  //     spy.restore()
  //
  //     spy.called.should.eql(true)
  //     var args = spy.firstCall.args
  //     should.not.exist(args[0])
  //     done()
  //   })
  //
  //   it('should delete a message if it is processed successfully', function(done) {
  //     var msg = {
  //       id: 'hello',
  //       message: 'XXX',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     var queueHandler = new QueueHandler()
  //
  //     var handlerStub = sinon.stub(QueueHandler.prototype, 'handle', function (err, req, done) {
  //       if (typeof done === 'function') {
  //         req.address = 'hello'
  //         done()
  //       }
  //     })
  //
  //     var spy = sinon.spy(fakeRsmq, 'del')
  //
  //     fakeRsmq.emit('data', msg)
  //
  //     spy.restore()
  //     handlerStub.restore()
  //
  //     spy.called.should.eql(true)
  //     var args = spy.firstCall.args
  //     args[0].should.eql(msg.id)
  //     done()
  //   })
  // })

  // describe.skip('processResponse', function () {
  //   it('should create a WorkerError when an error is returned by the QueueHandler', function (done) {
  //     queueHandler = new QueueHandler()
  //
  //     var handlerStub = sinon.stub(QueueHandler.prototype, 'handle', function (err, req, done) {
  //       if (typeof done === 'function') {
  //         req.address = 'hello'
  //         done('ERROR')
  //       }
  //     })
  //
  //     var msg = {
  //       message: 'XXX',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     fakeRsmq.emit('data', msg)
  //
  //     handlerStub.restore()
  //     handlerStub.calledTwice.should.eql(true)
  //     var arg = handlerStub.secondCall.args[0]
  //     arg.name.should.eql('WorkerError')
  //     arg.error.should.eql('ERROR')
  //     done()
  //   })
  //
  //   it('should create an ExceededError when an error is returned by the QueueHandler and there are no retries left', function (done) {
  //     queueHandler = new QueueHandler()
  //
  //     var handlerStub = sinon.stub(QueueHandler.prototype, 'handle', function (err, req, done) {
  //       if (typeof done === 'function') {
  //         req.address = 'hello'
  //         delete req.retries
  //         done('ERROR')
  //       }
  //     })
  //
  //     var msg = {
  //       message: 'XXX',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     fakeRsmq.emit('data', msg)
  //
  //     handlerStub.restore()
  //     handlerStub.calledTwice.should.eql(true)
  //     var arg = handlerStub.secondCall.args[0]
  //     arg.name.should.eql('ExceededError')
  //     done()
  //   })
  //
  //   it('should create an InvalidError when an returned message has no address', function (done) {
  //     queueHandler = new QueueHandler()
  //
  //     var handlerStub = sinon.stub(QueueHandler.prototype, 'handle', function (err, req, done) {
  //       if (typeof done === 'function') {
  //         req.address = []
  //         done('ERROR')
  //       }
  //     })
  //
  //     var msg = {
  //       message: 'XXX',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     fakeRsmq.emit('data', msg)
  //
  //     handlerStub.restore()
  //     handlerStub.calledTwice.should.eql(true)
  //     //console.log(handlerStub.secondCall.args)
  //     var arg = handlerStub.secondCall.args[0]
  //     arg.name.should.eql('InvalidError')
  //     done()
  //   })
  //
  //   it('should create a TimeoutError when a message timeout has passed', function (done) {
  //     queueHandler = new QueueHandler()
  //
  //     var handlerStub = sinon.stub(QueueHandler.prototype, 'handle', function (err, req, done) {
  //       if (typeof done === 'function') {
  //         req.address = 'hello'
  //         req.timeout = 1000
  //         done('ERROR')
  //       }
  //     })
  //
  //     var msg = {
  //       message: 'XXX',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     fakeRsmq.emit('data', msg)
  //
  //     handlerStub.restore()
  //     handlerStub.calledTwice.should.eql(true)
  //     var arg = handlerStub.secondCall.args[0]
  //     arg.name.should.eql('TimeoutError')
  //     done()
  //   })
  //
  //   it('should return true if no error', function (done) {
  //     queueHandler = new QueueHandler()
  //
  //     var handlerStub = sinon.stub(QueueHandler.prototype, 'handle', function (err, req, done) {
  //       if (typeof done === 'function') {
  //         req.address = 'hello'
  //         done()
  //       }
  //     })
  //
  //     var msg = {
  //       message: 'XXX',
  //       address: 'hello',
  //       sent: Date.now(),
  //       rc: 1
  //     }
  //
  //     var spy = sinon.spy(Broker.prototype, 'processResponse')
  //
  //     fakeRsmq.emit('data', msg)
  //
  //     spy.restore()
  //     spy.calledOnce.should.eql(true)
  //     spy.firstCall.returnValue.should.eql(true)
  //     done()
  //   })
  // })
