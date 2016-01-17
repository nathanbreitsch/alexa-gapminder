
var express = require('express');
var app = express();
var data = require('./data/json/countries.json');
var serveStatic = require('serve-static')

var analytics = require('./analytics.js');
var resolver = require('./resolveStat.js');

var dc = new analytics.DataContext(data);
//needed to support post requests
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(serveStatic(__dirname + '/client'));

var version = 0;
var message = {type: 'none'}

//hard core hacking, serve all static files like this
app.get('/bower_components/jquery/dist/jquery.min.js', function (req, res) {
  res.sendFile('client/bower_components/jquery/dist/jquery.min.js', { root: __dirname })
});

app.get('/bower_components/bootstrap/dist/js/bootstrap.min.js', function (req, res) {
  res.sendFile('client/bower_components/bootstrap/dist/js/bootstrap.min.js', { root: __dirname })
});

app.get('/bower_components/knockout/dist/knockout.js', function (req, res) {
  res.sendFile('client/bower_components/knockout/dist/knockout.js', { root: __dirname })
});

app.get('/bower_components/reqwest/src/reqwest.js', function (req, res) {
  res.sendFile('client/bower_components/reqwest/src/reqwest.js', { root: __dirname })
});

app.get('/bower_components/highcharts/highcharts.js', function (req, res) {
  res.sendFile('client/bower_components/highcharts/highcharts.js', { root: __dirname })
});

app.get('/app.js', function (req, res) {
  res.sendFile('client/app.js', { root: __dirname })
});

app.get('/app.css', function (req, res) {
  res.sendFile('client/app.css', { root: __dirname })
});

app.get('/bower_components/knockout/dist/knockout.js', function (req, res) {
  res.sendFile('client/bower_components/knockout/dist/knockout.js', { root: __dirname })
});

app.get('/bower_components/bootstrap/dist/css/bootstrap.min.css', function (req, res) {
  res.sendFile('client/bower_components/bootstrap/dist/css/bootstrap.min.css', { root: __dirname })
});

app.get('/', function (req, res) {
  res.sendFile('client/index.html', { root: __dirname })
});

app.post('/question', function(req, res){
  ++version;

  if(req.body.question.type == 'relationship'){
    var real_stat_1 = resolver.resolveStat(req.body.question.stat1.toUpperCase());
    var real_stat_2 = resolver.resolveStat(req.body.question.stat2.toUpperCase());
    message = {
      type: 'relationship',
      data: dc.getScatterData(real_stat_1, real_stat_2),
      stat1: real_stat_1,
      stat2: real_stat_2,
      title: real_stat_1+ ' v.s. ' + real_stat_2
    };
  }
  res.json({});

});

app.post('/update', function(req, res){

  if(req.body.version < version){
    res.json({
      version: version,
      visualization: message
    });
  }
  else{
    res.json(req.body)
  }
});




app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
