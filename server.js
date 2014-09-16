var fs        = require('fs');
var path      = require('path');
var _         = require('underscore');
var httpProxy = require('http-proxy');
var spawn     = require('child_process').spawn;
var http      = require("http");


var startPort, base;


var startApp = function(name, dir, start, port){
  process.chdir(dir);
  var child = spawn('node', [start, port]);
  console.log(name + ' on ' + port);
};

var setupApp = function(app){
  startApp(app.name, app.dir, app.start, app.port);
};

var setupProxy = function(config){
  var currPort = startPort+1;
  var router = {};

  _.each(config, function(app){
    app.port = currPort++;
    if(app.name.length > 0)
      router[app.name + '.' + base] = '127.0.0.1:' + app.port;
    else
      router[base] = '127.0.0.1:' + app.port;
  });

  var proxyConfig = {
    ws: true
  };

  var proxyServer = httpProxy.createProxyServer();

  http.createServer(function(req, res) {
    var proxyTo = router[req.headers.host];
    console.log("request: ", req.headers.host);
    console.log("proxyTo: ", proxyTo);

    if(proxyTo) {
      proxyServer.web(req, res, {
        target: proxyTo
      });
    } else {
      res.send(404);
    }

  }).listen(80);
};

var setup = function(){
  var json   = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
  var config = JSON.parse(json);
  var sites  = config.sites;

  base       = config.base;
  startPort  = config.startPort;

  setupProxy(sites);
  _.each(sites, setupApp);
};

setup();