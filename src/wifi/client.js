/*
client receives data from server after connect
*/
var net = require('net');
var randomBytes = require('random-bytes')
const commander = require('commander');
const scanner = require('node-wifi-scanner');

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-a, --address [address]', 'ip [address] for binding', '192.168.1.1')
  .option('-p, --port [port]', "[port] for binding", '1337')
  .option('-t, --transmitBytes [bytes]', "[bytes] to send", 10240)
  .parse(process.argv);

var signalStrength = 0;

function sendData(){
  var bytesToSend = Number(commander.transmitBytes);
  var bytesToSendBuffer = Buffer.alloc(4);
  
  bytesToSendBuffer.writeUInt32BE(bytesToSend);
  var bytes = randomBytes.sync(bytesToSend)
  
  var client = new net.Socket();
  
  client.on('data', function (data) {
    hrEnd = process.hrtime(hrstart);
    client.end()  
    console.info('Execution time:\t%ds\t%dms\t SignalStrength: %d0', hrEnd[0], hrEnd[1] / 1000000, signalStrength);  
    setInterval(() => {
      process.exit();  
    }, 1000);  
  });
  
  client.on('close', function () {
    process.exit();
  });
  
  var hrstart = process.hrtime();
  client.connect(commander.port, commander.address, function () {
    client.write(bytesToSendBuffer)
    client.write(bytes)
  });
}

scanner.scan((err, networks) => {
  if (err) {
    console.error(err);
    return;
  }
  var testWIFI = (networks.find(network=>{
    return network.ssid ==="wifitestbench";
  }));
  signalStrength = testWIFI.rssi;
  sendData();
});