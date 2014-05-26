var express =require('express');
var app = express();
var EJS = require('ejs');
var Knex = require('knex');
var dateFormat = require('dateformat');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var knex = Knex.initialize({
  client: 'sqlite',
  connection: {
    host: '127.0.0.1',
    filename: './owed.db',
    charset: 'utf8'
  }
});

var findByUsername = function(username, fn, users) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

var findById = function(id, fn) {
  knex('users').select().then(function (users) {
    if (users[id]) {
      fn(null, users[id]);
    }
    else {
      fn(new Error('User ' + id + ' does not exist'));
    }
  });
}

var prescreen = function(req, res) {
  if (req.user) {
    return req.user;
  }
  else {
    req.flash('error', 'You must be logged in to view that page');
    res.redirect('/login');
  }
}

// Passport session setup.
// //   To support persistent login sessions, Passport needs to be able to
// //   serialize users into and deserialize users out of the session.  Typically,
// //   this will be as simple as storing the user ID when serializing, and finding
// //   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id - 1, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      knex('users').select().then(function (users) {
        findByUsername(username, function(err, user) {
          if (err) { return done(err); }
	  if (!user) { return done(null, false, { message: 'Unknown user ' + username}); }
	  if (user.password != password) { return done(null, false, { message: 'Invalid Password' }); }
	  return done(null, user);
        }, users);
      });
    });
  }
));

app.configure(function() {
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keykey cam cam' }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
});

app.get('/setup', function(req, res) {
  knex.schema.createTable('entries', function (table) {
    table.string('username');
    table.increments('id').primary();
    table.dateTime('date');
    table.float('owed');
    table.string('description');
  }).then(function () {
    console.log('Entry setup complete!');
  });
  knex.schema.createTable('users', function (table) {
    table.string('username');
    table.string('email');
    table.increments('id').primary();
    table.string('password'); // TODO: insecure
  }).then(function () {
    knex('users').insert({username: 'pdowell', password: 'foo', email: 'foo@bar.com'}).then(function (r) {
      console.log('Seed user created');
    });
    console.log('User setup complete!');
  });

  res.send("your request is in process");
});

app.get('/test', function(req, res) {
  res.render('template.ejs', {title: 'foo'});
});

app.get('/', function(req, res) {
  res.render('base.ejs', {title: 'owed'});
});

app.get('/users/:username', function(req, res) {
  res.send("Welcome " + req.user.username + ". Just to verify, your username is " + req.params.username);
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function (req, res) {
    res.redirect('/entries');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

app.get('/login', function(req, res) {
  res.render('start.ejs', {title: "Login Page", message: req.flash('error') });
});

app.post('/register', function(req, res) {
  knex('users').insert({username: req.body.username, password: req.body.password, email: req.body.email}).then(function (r) {
    req.flash('error', 'Registration complete! Please login');
    res.redirect("/login");
  });
});

app.get('/register', function(req, res) {
  res.render('register.ejs', {title: "Registration Page", message: req.flash('error') });
});

app.get('/entry', function(req, res) {
  var user = prescreen(req, res);
  if (user)
    res.render('input.ejs', {title: 'New Entry'});
});

app.get('/entries', function(req, res) {
  var user = prescreen(req, res);
  if (user) {
    knex('entries').where('username', user.username).select().then(function (entries) {
    res.render('multipleoutputs.ejs', {title: 'Your Entries', entries: entries});
    });
  }
});

app.get('/entry/:id', function(req, res) {
  var user = prescreen(req, res);
  if (user) {
    knex('entries').where('id', req.params.id).andWhere('username', user.username).then(function (entries) {
      if (entries.length > 0)
        res.render('1output.ejs', {title: 'Your Entry', entry: entries[0]});
      else
        res.send("Error! Unable to find your entry!");
    });
  }
});

app.post('/entry/new', function(req, res) {
  var user = prescreen(req, res);
  if (user) {
    knex('entries').insert({username: user.username,
   	                    owed: req.body.owed,
	                    description: req.body.description,
	                    date: dateFormat(req.body.date)
    }).then(function (output) {
      res.redirect("/entry/" + output[0]);
    });
  }
});

app.listen(4000);
console.log('Listening on port 4000');
