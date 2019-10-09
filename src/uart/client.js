const SerialPort = require('serialport')
var randomBytes = require('random-bytes')
const commander = require('commander');
var fs = require('fs');

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-p, --port [port]', "COM-[port] used", 'COM5')
  .option('-b, --baudRate [baudrate]', "[baudrate] used", '9600') //9600, 19200, 38400, 57600, 115200
  .option('-t, --transmitBytes [bytes]', "[bytes] to send", '1024')
  .parse(process.argv);

var comPort = commander.port
var baudRate = Number(commander.baudRate)
var bytesToSend = Number(commander.transmitBytes);
var bytesToSendBuffer = Buffer.alloc(4);

bytesToSendBuffer.writeUInt32BE(bytesToSend);
var bytes = randomBytes.sync(bytesToSend)

const port = new SerialPort(comPort, { baudRate: baudRate })

port.on('data', function (data) {
  hrEnd = process.hrtime(hrstart);
  console.info('Execution time:\t%ds\t%dms', hrEnd[0], hrEnd[1] / 1000000);  
  process.exit();
})

var hrstart = process.hrtime();
port.write(bytesToSendBuffer)
port.write(bytes)