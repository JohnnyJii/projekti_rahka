'use strict';
require('dotenv').config();

const express = require('express');
const https = require('https');
const http = require('http');
const database = require('./modules/database');
const resize = require('./modules/resize');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const multer = require('multer');
const upload = multer({dest: 'public/files/'});

const app = express();



const sslkey  = fs.readFileSync('/etc/pki/tls/private/ca.key');
const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
const options = {
  key: sslkey,
  cert: sslcert
};


app.use(express.static('public'));

// create the connection to database
const connection = database.connect();

// testataan toimiiko tietokanta
database.select(connection, (results) => {
  console.log(results);
});

const insertToDB = (data, res, next) => {
  database.insert(data, connection, () => {
    next();
  });
};

const selectAll = (req, next) => {
  database.select(connection, (results) => {
    req.custom = results;
    next();
  });
};

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) { // if login not happening
      return res.redirect('/login.html');
    }
    req.logIn(user, function(err) {
      // send userID as cookie:
      res.cookie('userID', req.user.uID);
      if (err) {
        return next(err);
      }
      return res.redirect('/intro.html'); // if login succesful
    });
  })(req, res, next);
});

app.use('/register', (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log('hash', hash);
    db.register([req.body.username, hash], connection, () => {
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
      return res.redirect('/login.html');
    }
    req.logIn(user, function(err) {
      // send userID as cookie:
      res.cookie('userID', req.user.uID);
      if (err) {
        return next(err);
      }
      return res.redirect('/intro.html'); // if login succesful
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

// tallenna tiedosto
app.post('/upload', upload.single('kuva'), (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  next();
});

// tee thumbnail
app.use('/upload', (req, res, next) => {
  resize.resizeImage(req.file.path, 150, './public/thumbs/' +
      req.file.filename + '_thumb');
  next();
});

// tallenna tiedot tietokantaan
app.use('/upload', (req, res, next) => {
  const data = [
    req.body.fname,
    req.body.lname,
    req.file.filename,
    req.file.filename + '_thumb',
  ];
  insertToDB(data, res, next);
});

// hae päivitetyt tiedot tietokannasta
app.use('/upload', (req, res, next) => {
  selectAll(req, next);
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


app.listen(8000); //normal http traffic
https.createServer(options, app).listen(3000); //https traffic