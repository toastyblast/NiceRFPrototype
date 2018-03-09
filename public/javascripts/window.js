const SerialPort = require('serialport');

const ReadLine = SerialPort.parsers.Readline;
const serialPort = new SerialPort('COM5', {autoOpen: true}, function (err) {
    if (err) {
        return console.log('Error opening port: ', err.message);
    }
});
const readLineParser = serialPort.pipe(new ReadLine({delimiter: '\n'}));

readLineParser.on('data', function (data) {
    if (data === "") {
        //Do nothing...
    } else {
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

        var userMessage = document.forms["sendMessageForm"]["userMessage"].value;

        if (userMessage === "") {
            alert("You didn't give any input!");
            return console.log("ERROR: No input given!");
        }

        console.log("Message found in input box: " + userMessage);

        // Because there's no callback to write, write errors will be emitted on the port:
        serialPort.write(userMessage, function (err) {
            var textArea = document.getElementById("messageDisplay");

            if (err) {
                textArea.value += "NOT SENT: Error sending your message - " + userMessage + "\n";
                textArea.scrollTop = textArea.scrollHeight;
                return console.log('Error on write: ', err.message);
            }

            console.log('message written: ' + userMessage);
            textArea.value += "SENT: " + userMessage + "\n";
            textArea.scrollTop = textArea.scrollHeight;
            $('#textBox').val('');
        });
    });
});