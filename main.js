var app = require('app');
var BrowserWindow = require('browser-window');
var ipcMain = require('electron').ipcMain;

require('crash-reporter').start();
var mainWindow = null;
var windowTop = false;
var windowSize = 1;

app.on('window-all-closed', function () {
    //if (process.platform != 'darwin')
        app.quit();
});
app.on('ready', function () {
    // ブラウザ(Chromium)の起動, 初期画面のロード
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
          //nodeIntegration: false
        }
    });
    mainWindow.setAlwaysOnTop(windowTop);
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

//ipcをうけとるやつ
ipcMain.on('asynchronous-message', function(event, arg) {
  if(arg=='windowTop'){
    if(windowTop){ windowTop = false;
    }else{ windowTop = true;
    }
    mainWindow.setAlwaysOnTop(windowTop);
  }
  if(arg=='sizeChange'){
    switch (windowSize) {
      case 1:
        mainWindow.setSize(350,600);
        windowSize = 2;
        break;
      case 2:
        mainWindow.setSize(630,600);
        windowSize = 3;
        break;
      default:
        mainWindow.setSize(900,600);
        windowSize = 1;
    }

  }
  //event.sender.send('asynchronous-reply', 'pong');  // 送信元へレスポンスを返す
});
