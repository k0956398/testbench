var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var EchoCharacteristic = function () {
  EchoCharacteristic.super_.call(this, {
    uuid: 'ec0e',
    properties: ['read', 'write',
  //  'notify',
    'indicate'
  ],
    value: null
  });

  this._value = Buffer.alloc(0);
  this._updateValueCallback = null;
};

util.inherits(EchoCharacteristic, BlenoCharacteristic);

EchoCharacteristic.prototype.onReadRequest = function (offset, callback) {
  console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
  callback(this.RESULT_SUCCESS, this._value);
};

var buffer = Buffer.alloc(0)
var dataReceived = -1
var dataToReceive = 0

EchoCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
  if (dataReceived == -1) {
    dataToReceive = data.readUInt32BE()
    buffer = Buffer.alloc(0)

    dataReceived = 0;
    dataReceived += data.length - 4
    var dataSlice = data.slice(4, data.length)
    buffer = Buffer.concat([buffer, dataSlice])
  } else {
    dataReceived += data.length
    buffer = Buffer.concat([buffer, data])
  }

  if (dataReceived == dataToReceive) {
    this._updateValueCallback('OK');
    dataReceived = -1
    this._value = buffer;
  }
  callback(this.RESULT_SUCCESS);
};

EchoCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
  console.log('EchoCharacteristic - onSubscribe');
  this._updateValueCallback = updateValueCallback;
};

EchoCharacteristic.prototype.onUnsubscribe = function () {
  console.log('EchoCharacteristic - onUnsubscribe');
  this._updateValueCallback = null;
};

module.exports = EchoCharacteristic;
