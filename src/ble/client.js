// Connect to a peripheral running the echo service
// https://github.com/noble/bleno/blob/master/examples/echo

// subscribe to be notified when the value changes
// start an interval to write data to the characteristic

const noble = require('noble');
var randomBytes = require('random-bytes')
const commander = require('commander');

const ECHO_SERVICE_UUID = 'ec00';
const ECHO_CHARACTERISTIC_UUID = 'ec0e';


var hrstart = 0;
commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-t, --transmitBytes [bytes]', "[bytes] to send", 1024)
  .parse(process.argv);

var signalStrength = 0;

var bytesToSend = Number(commander.transmitBytes);
var bytesToSendBuffer = Buffer.alloc(4);

bytesToSendBuffer.writeUInt32BE(bytesToSend);
var bytes = randomBytes.sync(bytesToSend)

noble.on('stateChange', state => {
  if (state === 'poweredOn') {
    // console.log('Scanning');
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', peripheral => {
  // connect to the first peripheral that is scanned
  const name = peripheral.advertisement.localName;
  if(name=="echo")
	{
    noble.stopScanning();
    signalStrength = peripheral.rssi;

    //console.log(`Connecting to '${name}' ${peripheral.id}`);
    connectAndSetUp(peripheral);
  }
});

function connectAndSetUp(peripheral) {

  peripheral.connect(error => {
    //console.log('Connected to', peripheral.id);
    // specify the services and characteristics to discover
    const serviceUUIDs = [ECHO_SERVICE_UUID];
    const characteristicUUIDs = [ECHO_CHARACTERISTIC_UUID];

    peripheral.discoverSomeServicesAndCharacteristics(
      serviceUUIDs,
      characteristicUUIDs,
      onServicesAndCharacteristicsDiscovered
    );
  });

  peripheral.on('disconnect', () => {
    //console.log('disconnected')
  });
}

isWrite = true
function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
  const echoCharacteristic = characteristics[0];

  // data callback receives notifications
  echoCharacteristic.on('data', (data, isNotification) => {
    if (isWrite) {
      isWrite = false;
      hrEnd = process.hrtime(hrstart);
      echoCharacteristic.unsubscribe();
      console.info('Execution time:\t%ds\t%dms\t SignalStrength: %d', hrEnd[0], hrEnd[1] / 1000000, signalStrength);
      hrstart = process.hrtime();
      // echoCharacteristic.read((error, data) => {
      //   hrEnd = process.hrtime(hrstart);
      //   console.info('READ Execution time:\t%ds\t%dms', hrEnd[0], hrEnd[1] / 1000000);
      setInterval(() => {
        process.exit();
      }, 1000);
      // });
    }
  });

  // subscribe to be notified whenever the peripheral update the characteristic
  echoCharacteristic.subscribe(() => {
    hrstart = process.hrtime();
    echoCharacteristic.write(bytesToSendBuffer);
    echoCharacteristic.write(bytes);
  });
}