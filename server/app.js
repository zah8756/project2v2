// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const app = express();
// eslint-disable-next-line new-cap
const http = require('http').Server(app);
const io = require('socket.io')(http);
let users = [];

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/RPS';

// connects us to the moongoose server
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// conects our socket from the client side to the server side
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
  socket.on('room', (room) => {
    socket.join(room);

    socket.on('chat message', (msg) => {
      io.in(room).emit('chat message', msg);
      console.log(`message: ${msg}`);
    });

    // I got this logic code from https://github.com/Patrick-Batenburg/nodejs-socket-io-rock-paper-scissor-game
    socket.on('player choice', (playerName, choice) => {
      users.push({ userName: playerName, playerDecision: choice });
      if (users.length === 2) {
        if (users[0].playerDecision === 'rock') {
          if (users[1].playerDecision === 'rock') io.in(room).emit('tie', users);
          if (users[1].playerDecision === 'paper') io.in(room).emit('player 2 wins', users);
          if (users[1].playerDecision === 'scissors') io.in(room).emit('player 1 wins', users);
          users = [];
        } else if (users[0].playerDecision === 'paper') {
          if (users[1].playerDecision === 'rock') io.in(room).emit('player 1 wins', users);
          if (users[1].playerDecision === 'paper') io.in(room).emit('tie', users);
          if (users[1].playerDecision === 'scissors') io.in(room).emit('player 2 wins', users);
          users = [];
        } else if (users[0].playerDecision === 'scissors') {
          if (users[1].playerDecision === 'rock') io.in(room).emit('player 2 wins', users);
          if (users[1].playerDecision === 'paper') io.in(room).emit('player 1 wins', users);
          if (users[1].playerDecision === 'scissors') io.in(room).emit('tie', users);
          users = [];
        }
      }
    });
  });
});

// connects our server to a redis server to store information
let redisURL = {
  hostname: 'redis-10450.c13.us-east-1-3.ec2.cloud.redislabs.com',
  port: '10450',
};

let redisPASS = 'HYzUZdJ0EBoSjG7OGTApxL2lglCTsY5e';

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

// pull in our routes
const router = require('./router.js');

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/Rock.svg`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: 'Lets Rock',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookieParser());

app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  console.log('Missing CSRF token');
  return false;
});

// connects us to our router
router(app);

http.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});

