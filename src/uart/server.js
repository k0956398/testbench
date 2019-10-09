const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
var randomBytes = require('random-bytes')

const commander = require('commander');
commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-p, --port [port]', "COM-[port] used", '/dev/ttyUSB0')
    .option('-b, --baudRate [baudrate]', "[baudrate] used", '9600')
    .parse(process.argv);

var comPort = commander.port
var baudRate = Number(commander.baudRate)

const port = new SerialPort(comPort, { baudRate: baudRate })
var buffer = Buffer.alloc(0)
var dataReceived = 0
var dataToReceive = 0

// Switches the port into "flowing mode"
port.on('data', function (data) {
    if (dataReceived == 0) {
        dataToReceive = data.readUInt32BE()
        buffer = Buffer.alloc(0)

        dataReceived += data.length - 4
        var dataSlice = data.slice(4, data.length)
        buffer = Buffer.concat([buffer, dataSlice])
    } else {
        dataReceived += data.length
        buffer = Buffer.concat([buffer, data])
    }

    if (dataReceived == dataToReceive) {
        port.write("OK")
        dataReceived = 0
    }
})

