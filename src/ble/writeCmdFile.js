var fs = require('fs');

var jsonCmdList = {
    "2B":"00D11C",
    "2F":"000102",
    "31":"075369676D613130",
    "32":"0548616c6c6f",
    "61":"313233343536",
    "64":"010000",
    "2E":"0000000000" ,
    "34":"000102",
    "52":"5369676D61313000DE0001B1B1ED7351"
}

fs.unlinkSync('cmd.json', (err) => {})
fs.appendFileSync('cmd.json', JSON.stringify(jsonCmdList),(err) => {})

/*console.log(JSON.stringify(jsonCmdList))
var fileData = fs.readFileSync('cmd.json', (err) => {})
console.log(fileData.toString())
var cmdFromFile = JSON.parse(fileData.toString());
console.log(cmdFromFile["2F"])*/