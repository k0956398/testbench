/*
server sends data
*/
var net = require('net');
const commander = require('commander');

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-a, --address [address]', 'ip [address] for binding', '192.168.1.1')
  .option('-p, --port [port]', "[port] for binding", '1337')
  .parse(process.argv);

var buffer = Buffer.alloc(0)
var dataReceived = -1
var dataToReceive = 0
var server = net.createServer((c) => {
  c.on('end', () => { 
    console.log('client end.') 
  }); //not used
  c.on('data', function (data) {
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
      c.write('OK')
      dataReceived = -1
    }
  })
});
server.on('error', (err) => {
  console.log('error occured.')
});

server.listen(commander.port, commander.address);
console.log('server started');
