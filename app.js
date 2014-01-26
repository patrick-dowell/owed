var express =require('express');
var app = express();
var EJS = require('ejs');
var Knex = require('knex');
var dateFormat = require('dateformat');

var knex = Knex.initialize({
  client: 'sqlite',
  connection: {
    host: '127.0.0.1',
    filename: './owed.db',
    charset: 'utf8'
  }
});

app.use(express.bodyParser());
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.get('/setup', function(req, res) {
  knex.schema.createTable('entries', function (table) {
    table.string('username');
    table.increments('id').primary();
    table.dateTime('date');
    table.float('owed');
    table.string('description');
  }).then(function () {
    console.log('Setup complete!');
  });
  res.send("your request is in process");
});

app.get('/test', function(req, res) {
  res.render('template.ejs', {title: 'foo'});
});

app.get('/entry', function(req, res) {
  res.render('input.ejs', {title: 'New Entry'});
});

app.get('/entries', function(req, res) {
  knex('entries').select().then(function (entries) {
    res.render('multipleoutputs.ejs', {title: 'Your Entries', entries: entries});
  });
});

app.get('/entry/:id', function(req, res) {
  knex('entries').where('id', req.params.id).then(function (entries) {
    if (entries.length > 0)
      res.render('1output.ejs', {title: 'Your Entry', entry: entries[0]});
    else
      res.send("Error! Unable to find your entry!");
  });
});

app.post('/entry/new', function(req, res) {
  knex('entries').insert({username: "foo", 
	                  owed: req.body.owed, 
	                  description: req.body.description,
	                  date: dateFormat(req.body.date)
  }).then(function (output) {
    res.send('new entry successfully uploaded!');
  });
});

app.listen(3000);
console.log('Listening on port 3000');
