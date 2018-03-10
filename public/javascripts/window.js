const SerialPort = require('serialport');

const Readline = SerialPort.parsers.Readline;
//FIXME: Change the number after "COM" to the port given by your device. This can be found in the device manager, if you are an admin of the computer!
const serialPort = new SerialPort('COM5', {autoOpen: true}, function (err) {
    if (err) {
        return console.log('Error opening port: ', err.message);
    } else {
        return console.log("DEBUG - PORT OPENED");
    }
});
//TODO - TEACHER: If you use the serialport debugging assistant from the NiceRF company, always have an enter after
// TODO: your message, before sending it. The JS serialport requires there to be a delimiter, and only messages ending
// TODO: with such a delimiter will be shown when received, otherwise they will be buffered until the delimiter is received.
const readLineParser = serialPort.pipe(new Readline({delimiter: '\n'}));

readLineParser.on('data', function (data) {
    if (data === "") {
        //Do nothing...
    } else {
        console.log("DEBUG - MESSAGE RECEIVED", data);

        var textArea = document.getElementById("messageDisplay");
        textArea.value += "RECEIVED: " + data + "\n";

        console.log("Data received:", data);

        textArea.scrollTop = textArea.scrollHeight;
    }
});

// Read data that is available but keep the stream from entering "flowing mode"
serialPort.on('readable', function () {
    console.log('Readable data:', serialPort.read());
});

$(document).ready(function () {
    $("#messageForm").submit(function (event) {
        event.preventDefault();

        var userMessage = document.forms["sendMessageForm"]["userMessage"].value + '\n';

        if (userMessage === "") {
            alert("You didn't give any input!");
            return console.log("ERROR: No input given!");
        }

        console.log("Message found in input box: " + userMessage);

        // Because there's no callback to write, write errors will be emitted on the port:
        serialPort.write(userMessage, function (err) {
            var textArea = document.getElementById("messageDisplay");

            if (err) {
                textArea.value += "NOT SENT: Error sending your message - " + userMessage;
                textArea.scrollTop = textArea.scrollHeight;
                return console.log('Error on write: ', err.message);
            }

            console.log('message written: ' + userMessage);
            textArea.value += "SENT: " + userMessage;
            textArea.scrollTop = textArea.scrollHeight;
            $('#textBox').val('');
        });
    });
});