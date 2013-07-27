var fs  = require('fs'),
path    = require('path'),
_       = require('underscore'),
httpProxy = require('http-proxy'),
spawn = require('child_process').spawn;

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
    hostnameOnly: true,
    router: router
  };

  var proxyServer = httpProxy.createServer(proxyConfig);
  proxyServer.listen(80);
};

var setup = function(){
  var json = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
  var config = JSON.parse(json);

  sites = config.sites;
  base = config.base;
  startPort = config.startPort;

  setupProxy(sites);
  _.each(sites, setupApp);
};

setup();