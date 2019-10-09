var bleno = require('bleno');
var Characteristics = require('./raspiCharacteristic')
var SerialPort = require('serialport')
var Response = require('./getResponseCrc.js')

var BlenoPrimaryService = bleno.PrimaryService;
var advertismentData = Buffer.from('0201060319000007FF02E51CD100000609526173706900', 'hex')

var port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1
})

console.log('Bleno: started script');
bleno.on('stateChange', function(state){
    if(state === 'poweredOn'){
        bleno.startAdvertisingWithEIRData(advertismentData)
    } else {
        bleno.stopAdvertising()
    }   console.log(`Bleno: state: ${state}`)
})

bleno.on('advertisingStart', function(error){
    console.log(`Bleno: started advertising: ${error ? 'error ' + error : 'success'}\n`)

    if (!error) {
        bleno.setServices([
          new BlenoPrimaryService({
            uuid: '0000a002-0000-1000-8000-00805f9b34fb',
            characteristics: [new Characteristics.read (), new Characteristics.write()]
          })
        ])
      }
})

bleno.on('accept', function(clientAddress) {
    console.log(`Bleno: Accepted connection from address: ${clientAddress}\n`)
})

bleno.on('disconnect', function(clientAddress) {
    console.log(`Bleno: Disconnected from address: ${clientAddress}\n`)
})

var buffer
var dataReceived = 0
var dataToReceive = 0
var DIASanswered = false

port.on('data',
function(data)
{
    console.log(`SerialPort: onData ${data.toString('hex')}`)

    if (dataReceived == 0) {
        if (data.length >= 4)
            dataToReceive = 2 + 1 + 1 + data[3] + 1
        buffer = Buffer.alloc(0)

        dataReceived += data.length
        buffer = Buffer.concat([buffer, data])
    } else {
        if (dataReceived >= 4 && dataToReceive <= 0)
            dataToReceive = 2 + 1 + 1 + buffer.readUInt16(3) + 1

        dataReceived += data.length
        buffer = Buffer.concat([buffer, data])
    }

    if (dataReceived == dataToReceive) {
        console.log(`SerialPort: onData finished ${buffer.toString('hex')}`)
        if (buffer.readUInt8(2) == 0x52)
        {
            if (!DIASanswered)
            {
                port.write(Response.get(buffer))
                DIASanswered = true
            }
        }
        else
        {
            DIASanswered = false
            port.write(Response.get(buffer))
        }

        dataReceived = 0
    }
})

port.on('error', function(error){
    console.log(`SerialPort: an error occured: ${error}`)
})