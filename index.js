var express = require('express')
var path = require('path')
var app = express();

var http = require('http'),
  httpProxy = require('http-proxy');

app.use('/css', express.static(path.join(__dirname, 'css')));

app.use('/cursor', express.static(path.join(__dirname, 'cursor')));

app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

app.use('/icon', express.static(path.join(__dirname, 'icon')));

app.use('/js', express.static(path.join(__dirname, 'js')));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname})
})

var proxy = require('http-proxy-middleware');

var wsProxy = proxy('/ptt_ws', {
  target: 'https://ws.ptt.cc/bbs',
  ws: true,
  logLevel: 'debug',
  onError: function(err, req, res) {
    console.log("onError");
    console.log(err);
  },
  headers: {
    host: 'ws.ptt.cc',
    Origin: 'app://pcman'
  }
});

app.use(wsProxy);

var server = app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})

server.on('upgrade', wsProxy.upgrade)
