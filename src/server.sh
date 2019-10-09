sudo node ble/server.js &
blePID=$!
sudo node uart/server.js &
uartPID=$!
sudo node wifi/server.js &
wifiPID=$!

read -p "Press enter to stop server"

kill $blePID
kill $uartPID
kill $wifiPID
