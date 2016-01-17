
var express = require('express');
var app = express();

//needed to support post requests
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var version = 0;

app.use(express.static('client'));

app.get('/', function (req, res) {
  res.sendFile('client/index.html')
});

app.post('/question', function(req, res){
  ++version;
  res.json({});
});

app.post('/update', function(req, res){

  if(req.body.version < version){
    res.json({
      version: version,
      message: "penis"
    });
  }
  else{
    res.json(req.body)
  }
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
