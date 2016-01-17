
var express = require('express');
var app = express();
var data = require('./data/json/countries.json');
var analytics = require('./analytics.js');

var dc = new analytics.DataContext(data);
//needed to support post requests
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var version = 0;
var message = {type: 'none'}

app.use(express.static('client'));

app.get('/', function (req, res) {
  res.sendFile('client/index.html')
});

app.post('/question', function(req, res){
  ++version;

  if(req.body.question.type == 'relationship'){
    message = {
      type: 'relationship',
      data: dc.getScatterData(req.body.question.stat1, req.body.question.stat2),
      stat1: req.body.question.stat1,
      stat2: req.body.question.stat2,
      title: req.body.question.stat1 + ' v.s. ' + req.body.question.stat2
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
