var express =require('express');
var app = express();
var EJS = require('ejs');

app.get('/hello.txt', function(req, res) {
  res.send('Hello World');
});

app.get('/test', function(req, res) {
  res.render('template.ejs', {title: 'foo'});
});

app.listen(3000);
console.log('Listening on port 3000');
