var util = require('util');
var bleno = require('bleno');
var Response = require('./getResponseCrc.js')
var readUpdateValueCB

var WriteCharacteristic = function () {
  WriteCharacteristic.super_.call(this, {
    uuid: '0000c301-0000-1000-8000-00805f9b34fb',
    properties: ['write', 'writeWithoutResponse'],
    value: null
  });
  console.log('Bleno: WriteCharacteristic initialized\n')
}

var ReadCharacteristic = function () {
    ReadCharacteristic.super_.call(this, {
      uuid: '0000c302-0000-1000-8000-00805f9b34fb',
      properties: ['read', 'indicate'],
      value: null,
    })
    this._value = new Buffer(0)
    this._updateValueCallback = null
    console.log('Bleno: ReadCharacteristic initialized')
}

util.inherits(ReadCharacteristic, bleno.Characteristic)
util.inherits(WriteCharacteristic, bleno.Characteristic)

WriteCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback)
{
  this._value = data.toString('hex')
  console.log(`Bleno: onWriteRequest: value = ${this._value}`)

  if (readUpdateValueCB)
  {
    console.log(`Bleno: onWriteRequest: notifying`)
    readUpdateValueCB(Response.get(data))
  }

  callback(this.RESULT_SUCCESS)
}

ReadCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log(`Bleno: onReadRequest: value = ${this._value}`)

  callback(this.RESULT_SUCCESS, this._value)
}

ReadCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
  console.log('Bleno: connected device has subscribed\n')
  this._updateValueCallback = updateValueCallback
  readUpdateValueCB = updateValueCallback
}

ReadCharacteristic.prototype.onUnsubscribe = function () {
    console.log('Bleno: connected device has unsubscribed\n')
    readUpdateValueCB = null
    this._updateValueCallback = null
}

module.exports.read = ReadCharacteristic
module.exports.write = WriteCharacteristic