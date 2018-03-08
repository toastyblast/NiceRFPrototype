const {app, BrowserWindow} = require('electron');

let mainWindow = null;

// Wait until the app is ready
app.on('ready', function () {
    // Create a new window
    mainWindow = new BrowserWindow({width: 500, height: 500});

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});

app.on('window-all-closed', function() {
    app.quit();
});