function executeBLETest($iterations, $payload){
    $date = Get-Date
    Write-Output "BLE Tests with $payload payloadbyte(s) started $date" >> out.log
    For ($i=0; $i -lt $iterations; $i++) {
        node ble/client.js -t $payload >> out.log
    }
    $date = Get-Date
    Write-Output "BLE Tests Tests ended $date" >> out.log
}

function executeUARTTest($iterations, $payload){
    $date = Get-Date
    Write-Output "UART Tests with $payload payloadbyte(s) started $date" >> out.log
    For ($i=0; $i -lt $iterations; $i++) {
        node uart/client.js -t $payload >> out.log
    }
    $date = Get-Date
    Write-Output "UART Tests Tests ended $date" >> out.log
}

function executeWIFITest($iterations, $payload){
    $date = Get-Date
    Write-Output "WIFI Tests with $payload payloadbyte(s) started $date" >> wifi.log
    For ($i=0; $i -lt $iterations; $i++) {
        node wifi/client.js -t $payload >> wifi.log
    }
    $date = Get-Date
    Write-Output "WIFI Tests Tests ended $date" >> wifi.log
}
if(Test-Path .\out.log) {
	Remove-Item .\out.log
}
if(Test-Path .\wifi.log) {
	Remove-Item .\wifi.log
}

executeBLETest  -iterations 5 -payload 1
executeUARTTest -iterations 5 -payload 1
executeWIFITest -iterations 5 -payload 1

executeBLETest -iterations 5 -payload 100
executeUARTTest -iterations 5 -payload 100
executeWIFITest -iterations 5 -payload 100

executeBLETest -iterations 5 -payload 1024
executeUARTTest -iterations 5 -payload 1024
executeWIFITest -iterations 5 -payload 1024

executeBLETest -iterations 5 -payload 10240
executeUARTTest -iterations 5 -payload 10240
executeWIFITest -iterations 5 -payload 10240

executeBLETest -iterations 5 -payload 65535
executeUARTTest -iterations 5 -payload 65535
executeWIFITest -iterations 5 -payload 65535

executeBLETest -iterations 5 -payload 655350
executeUARTTest -iterations 5 -payload 655350
executeWIFITest -iterations 5 -payload 655350