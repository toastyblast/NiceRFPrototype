var SerialPort = require('serialport');
var serialPort = new SerialPort('COM5', {autoOpen: true}, function (err) {
    if (err) {
        return console.log('Error opening port: ', err.message);
    }
});

// The open event is always emitted
serialPort.on('data', function (data) {
    console.log('Data:', data);
});

// Read data that is available but keep the stream from entering "flowing mode"
serialPort.on('readable', function () {
    console.log('Data:', serialPort.read());
});

$(document).ready(function () {
    $("#messageForm").submit(function (event) {
        event.preventDefault();

        var userMessage = document.forms["sendMessageForm"]["userMessage"].value;

        if (userMessage === "") {
            return console.log("ERROR: No input given!");
        }

        console.log("Message found in input box: " + userMessage);

        // Because there's no callback to write, write errors will be emitted on the port:
        serialPort.write(userMessage, function (err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written: ' + userMessage);
        });
    });
});