"use strict";

var fs = require('fs');
var setURL = [];
//var textPath = './saveURL.txt';//debug
var textPath = './resources/app/saveURL.txt';//build

fs.readFileSync(textPath, 'utf-8').toString().split('\n').forEach(function (line) {
  if(line!="") setURL.push(line);
})

var ipcRenderer = require("electron").ipcRenderer;
var tabNum = 5;
var selectTab = 1;

//起動時
if( window.addEventListener ){
    window.addEventListener( 'load', initApp(), false );
}else if( window.attachEvent ){
    window.attachEvent( 'onload', initApp() );
}else{
    window.onload = initApp();
}

//DnDしたときにページの遷移を無効
var appQuit = true;
window.onbeforeunload = function(e) {
  if(appQuit){
    return true;
  }else{
    appQuit = true;
    return false;
  }
}

//起動時に発火するやつら
function initApp(){
  for(var i=0;i<tabNum;i++){
    //console.log(setURL[i]);
    tabOpen(setURL[i],i+1);
  }
  /*
  tabOpen("https://tweetdeck.twitter.com/",1);
  tabOpen("https://shisonoha.slack.com/",2);
  tabOpen("https://miyashitalab.slack.com/",3);
  tabOpen("https://mloa.slack.com/",4);
  tabOpen("https://www.chatwork.com/#!rid17751770",5);
  */
}

//urlを指定した番号のidに投げる
function tabOpen(_url,_num){
  var webview_wrapper = document.getElementById("webview_wrapper_"+_num);
  webview_wrapper.removeChild(webview_wrapper.lastChild);

  // create_new_webview_instanse
  var newWebview = document.createElement("webview");
  newWebview.id = "foo_"+_num;
  newWebview.setAttribute("class","webview");
  newWebview.setAttribute("src",_url);
  newWebview.setAttribute("style", "width:100%; height:100%");
  // append new_webview
  webview_wrapper.appendChild(newWebview);
}

//各々のwebviewタグを取得するやつ（きれいにしたい）
let webview_1 = document.getElementById('foo_1');
let webview_2 = document.getElementById('foo_2');
let webview_3 = document.getElementById('foo_3');
let webview_4 = document.getElementById('foo_4');
let webview_5 = document.getElementById('foo_5');

//ウィンドウを開くやつ
for(var i=1;i<tabNum+1;i++){
  eval(
    "webview_"+i+".addEventListener('new-window', function(e){"+
      "require('shell').openExternal(e.url);"+
    "});"
  );
}
//webview内でのdevツールを開くやつ
function opendev(){
 var webview = document.getElementById("foo_"+selectTab);
 webview.openDevTools();
}
//styleの設定
var styleSet = "position:absolute; top:0px; left:0px; ";

//キー操作（press）
var pressKey = false;
window.addEventListener("keydown", handleKeydown);
function handleKeydown(event){
  if(pressKey) return;
  pressKey = true;
  if(event.altKey) pressKey = false;
  var keyCode = event.keyCode;
  //console.log(keyCode);
  //0は48,1は49~9は57
  if(keyCode>47&&keyCode<58&&event.altKey){
    switch (keyCode) {
      case 49://49は1
        selectTab = 1;
        break;
      case 50://50は2
        selectTab = 2;
        break;
      case 51://51は3
        selectTab = 3;
        break;
      case 52://52は4
        selectTab = 4;
        break;
      case 53://53は5
        selectTab = 5;
        break;
      default://
    }
    for(var i=1;i<tabNum+1;i++){
      document.getElementById("webview_wrapper_"+i).setAttribute("style", styleSet+"z-index:80;");
    }
    document.getElementById("webview_wrapper_"+selectTab).setAttribute("style", styleSet+"z-index:100;");
  }
  //alt+enterで最前面固定
  if(keyCode==13&&event.altKey){
    ipcRenderer.send('asynchronous-message', 'windowTop');
  }
  //alt+wでsize1
  if(keyCode==87&&event.altKey){
    ipcRenderer.send('asynchronous-message', 'sizeChange');
  }

  //alt+mでミュート
  if(keyCode==77&&event.altKey){
    eval("webview_"+selectTab+".setAudioMuted(!webview_"+selectTab+".isAudioMuted());");
    eval("console.log('tab"+selectTab+":mute-'+webview_"+selectTab+".isAudioMuted());");
  }

}


document.addEventListener('drop', function(e) {
  appQuit = false;
});

//key操作（up）
window.addEventListener("keyup", handleKeyup);
function handleKeyup(event){
  pressKey = false;
}
