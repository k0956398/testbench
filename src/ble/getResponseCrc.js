var fs = require('fs')

var getCRC = function(data)
{
  var crc = 0
  for(i = 0; i < data.length-1; i++)
  {
    crc += data.readUInt8(i)
  }

  return crc % 0x100
}

module.exports.get = function(data)
{
    var cmd = data.readUInt8(2).toString(16).toUpperCase();
    console.log(`received cmd: ${cmd}`)

    var fileData = fs.readFileSync('/home/pi/Desktop/bleHacking/commTest/CommTests/src/ble/cmd.json', (err) => {})
    var cmdFromFile = JSON.parse(fileData.toString());

    try {
        var responsePayload = Buffer.from(cmdFromFile[cmd], 'hex')
        var responseBuffer = Buffer.alloc(3+1+1+responsePayload.byteLength+1)
        data.copy(responseBuffer, 0, 0, 3)
        responseBuffer.writeUInt8(responsePayload.byteLength+1, 3)
        responseBuffer.writeUInt8(6, 4)
    } catch(err) {
        console.log('received invalid command')
        var responsePayload = Buffer.from('FE', 'hex')
        var responseBuffer = Buffer.alloc(3+1+1+1+1)
        data.copy(responseBuffer, 0, 0, 3)
        responseBuffer.writeUInt8(responsePayload.byteLength+1, 3)
        responseBuffer.writeUInt8(21, 4)
    }

    responsePayload.copy(responseBuffer, 5, 0, responsePayload.byteLength)
    responseBuffer.writeUInt8(getCRC(responseBuffer), responseBuffer.byteLength-1)

    console.log(responseBuffer)
    return responseBuffer
}