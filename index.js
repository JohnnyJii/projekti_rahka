'use strict';
require('dotenv').config();

const express = require('express');
const db = require('./modules/database');
//const resize = require('./modules/resize');
//const exif = require('./modules/exif');
const fs = require('fs');
const https = require('https');
const http = require('http');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const bcrypt = require('bcrypt');
const saltRounds = 10;


const multer = require('multer');
const upload = multer({dest: 'public/uploads/'});

const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

// enable cookies to send userID to client
app.use(cookieParser());

// database connection
const connection = db.connect();

// login with passport
passport.serializeUser((user, done) => {
  console.log('serialize:', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// function to check if the user has logged in, to be used in middleware
const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send('{"error": "Not logged in!"}');
  }
};

/*app.use(session({
  secret: 'keyboard LOL cat',
  resave: true,
  saveUninitialized: true,
  cookie: {secure: true},
}));*/

passport.use(new LocalStrategy(
    (username, password, done) => {
      console.log('Käyttäjätunnus: ' + username);
      let res = null;

      const doLogin = (username, password) => {
        return new Promise((resolve, reject) => {
          db.login([username], connection, (result) => {
            bcrypt.compare(password, result[0].passwd, function(err, res) {
              // res == true
              if (res) {
                resolve(result);
              } else {
                reject(err);
              }
            });
          });
        });
      };

      return doLogin(username, password).then((result) => {
        if (result.length < 1) {
          console.log('undone');
          return done(null, false);
        } else {
          console.log('done');
          result[0].passwd = ''; // remove password from user's data
          return done(null, result[0]); // result[0] is user's data, accessible as req.user
        }
      });
    },
));

app.use(passport.initialize());
app.use(passport.session());


app.post('/login',
    passport.authenticate('local',
        {
          successRedirect: '/node/intro.html',
          failureRedirect: '/node/login.html',
        },
    ),
);


app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) { // if login not happening
      return res.redirect('/node/login.html');
    }
    req.logIn(user, function(err) {
      // send userID as cookie:
      res.cookie('userID', req.user.userID);
      if (err) {
        return next(err);
      }
      return res.redirect('/node/intro.html'); // if login succesful
    });
  })(req, res, next);
});

app.use('/register', (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log('hash', hash);
    db.register([req.body.FName, req.body.LName, req.body.username, hash], connection, () => {
      next();
    });
  });
});

app.post('/register', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) { // if login not happening
      alert("Väärä sähköpostiosoite tai salasana!");
      return res.redirect('/node/login.html');
    }
    req.logIn(user, function(err) {
      // send userID as cookie:
      res.cookie('userID', req.user.userID);
      if (err) {
        return next(err);
      }
      return res.redirect('/node/intro.html'); // if login succesful
    });
  })(req, res, next);
});


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('./login.html');
});


app.get('/', (req, res) => {
  // check for https
  if (req.secure) {
    console.log('req.user', req.user);
    // if user is not logged
    if (req.user !== undefined) {
      res.redirect(301, 'login.html');
    } else {
      res.redirect(301, 'login.html');
    }
  } else {
    // if not https
    res.send('{"status": "not https"}');
  }
});

// serve static files
app.use(express.static('public'));
// serve node_modules
app.use('/modules', express.static('node_modules'));

// database select calback
const cb = (result, res) => {
  console.log(result);
  res.send(result);
};


// testataan toimiiko tietokanta
db.select(connection, (results) => {
  console.log(results);
});

const insertToDB = (data, res, next) => {
  db.insert(data, connection, () => {
    next();
  });
};

const selectAll = (req, next) => {
  db.select(connection, (results) => {
    req.custom = results;
    next();
  });
};


// tallenna tiedot tietokantaan
app.use('/upload', (req, res, next) => {
  console.log('user id', req.user.userID);

  const data = [
    req.body.FName,
    req.body.LName,
    req.body.username,
    req.body.password,


  ];
  db.insert(data, connection, next);
});

app.use('/upload', (req, res) => {
  res.send('{"status": "insert OK"}');
});

// lähetä tiedot selaimeen
app.use('/upload', (req, res) => {
  res.send(req.custom);
});

app.post('/lisaareitti', (req, res) => {
  const rp = req.query.reittipiste;
  // lisää rp tietokantaan
  console.log('reittip', rp);
  res.send(rp);
});


app.get('/test', (req,res) => {
  if (req.secure) res.send('https :)');
  else res.send('hello not secure?');
});

app.set('trust proxy');
const sslkey  = fs.readFileSync('/etc/pki/tls/private/ca.key');
const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
const options = {
  key: sslkey,
  cert: sslcert,
};

// start http and https servers, server address is https://servername/node/ e.g. https://10.114.34.45/node/
// app.listen(3000);
http.createServer((req, res) => {
  const redir = 'https://' + req.headers.host + '/node' + req.url;
  console.log('redir', redir);
   res.end();
}).listen(8000);
https.createServer(options, app).listen(3000);

