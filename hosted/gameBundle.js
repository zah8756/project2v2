'use strict';

var socket = io();
var submitted = false;
var name = 'test';
//reads our text then using socket sends it to the server to be displayed 
var handleText = function handleText(e) {
  e.preventDefault(); // prevents page reloading
  console.log('clap');
  //changed how I find the player now it properly displays who typed what in chat 
  socket.emit('chat message', $('#username').val() + " : " + $('#m').val());
  $('#m').val('');

  return false;
};
//connects us to our room would have done more with room but ran out of time 
var sok = function sok() {
  console.log($('#roomName').val());
  socket.on('connect', function () {
    socket.emit('room', $('#roomName').val());
  });

  socket.on('chat message', function (msg) {
    console.log('activated');

    $('#messages').append($('<li>').text('' + msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
};

// chekcs what option we picked and send it to ther server then we get back the result in game check 
var handleRPS = function handleRPS(e) {
  e.preventDefault();
  console.log("activated");
  var userChoice = $('input[name=choice]:checked').val();
  if (!submitted) {
    submitted = true;
    socket.emit('player choice', name, userChoice, $('#roomName').val());
    $('#info').html('Waiting for the other players decision');
  } else $('#info').html('You can not change your decision');

  return false;
};

//using the result of the game we determine the outcome
var gameCheck = function gameCheck() {
  socket.on('tie', function () {
    $('#info').append($('<li>').text('A tie!'));
    submitted = false;
    setTimeout(function () {
      $('#info').html('Waiting for players input');
    }, 5000);
  });

  //the players descions are now disaplyed after every round to see how you won or lost 
  socket.on('player 1 wins', function (user) {
    $('#info').append($('<li>').text(user[0].userName + ' picked ' + user[0].playerDecision));
    $('#info').append($('<li>').text(user[1].userName + ' picked ' + user[1].playerDecision));
    $('#info').append($('<li>').text(user[0].userName + ' wins!'));
    submitted = false;
    if (user[0].userName === name) {
      updateWins();
    } else {
      updateLosses();
    }

    setTimeout(function () {
      $('#info').html('Waiting for players input');
    }, 5000);
  });

  socket.on('player 2 wins', function (user) {
    $('#info').append($('<li>').text(user[1].userName + ' picked ' + user[1].playerDecision));
    $('#info').append($('<li>').text(user[0].userName + ' picked ' + user[0].playerDecision));
    $('#info').append($('<li>').text(user[1].userName + ' wins!'));
    submitted = false;
    if (user[1].userName === name) {
      updateWins();
    } else {
      updateLosses();
    }
    setTimeout(function () {
      $('#info').html('Waiting for players input');
    }, 5000);
  });
};

//create the forms for our rps game and our global text

var GameForm = function GameForm(props) {
  return React.createElement(
    'form',
    { id: 'messageForm',
      onSubmit: handleText,
      name: 'messageForm',
      action: '',
      method: 'POST' },
    React.createElement('input', { id: 'm', type: 'text', autocomplete: 'off' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { id: 'sButton', className: 'buttonSend', type: 'submit', value: 'Send' })
  );
};
//creates the basis for rock paper scissors from 
var RPSForm = function RPSForm(props) {
  return React.createElement(
    'form',
    { id: 'RPSForm',
      onSubmit: handleRPS,
      action: '',
      name: 'RPSForm',
      method: 'POST' },
    React.createElement('input', { id: 'rock', type: 'radio', name: 'choice', value: 'rock', checked: true }),
    React.createElement(
      'label',
      { htmlFor: 'rock' },
      React.createElement('img', { id: 'rock', src: '/assets/img/cRock.png', alt: 'rock logo' })
    ),
    React.createElement('br', null),
    React.createElement('input', { id: 'paper', type: 'radio', name: 'choice', value: 'paper' }),
    React.createElement(
      'label',
      { htmlFor: 'paper' },
      React.createElement('img', { id: 'paper', src: '/assets/img/paper.png', alt: 'paper logo' })
    ),
    React.createElement('br', null),
    React.createElement('input', { id: 'scissors', type: 'radio', name: 'choice', value: 'scissors' }),
    React.createElement(
      'label',
      { htmlFor: 'scissors' },
      React.createElement('img', { id: 'scissors', src: '/assets/img/scissors.png', alt: 'scissors logo' })
    ),
    React.createElement('br', null),
    React.createElement('input', { id: 'csrftoken', type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('br', null),
    React.createElement('input', { className: 'gameButton', id: 'submitButton', type: 'submit', value: 'make decision' })
  );
};
//incriments whoever wins win value and updateLosses does the same with losses 
var updateWins = function updateWins() {
  sendAjax('POST', '/update', '_csrf=' + document.querySelector('#csrftoken').value + '&playerN=' + name, function () {});
};

var updateLosses = function updateLosses() {
  sendAjax('POST', '/updateLosses', '_csrf=' + document.querySelector('#csrftoken').value + '&playerN=' + name, function () {});
};
var ifActive = function ifActive(csrf) {
  if (document.querySelector('#sender')) {
    ReactDOM.render(React.createElement(GameForm, { csrf: csrf }), document.querySelector('#sender'));
  }
};
var ifRPS = function ifRPS(csrf) {
  if (document.querySelector('#RPS')) {
    ReactDOM.render(React.createElement(RPSForm, { csrf: csrf }), document.querySelector('#RPS'));
  }
};

var setup = function setup(csrf) {
  ifActive(csrf);
  ifRPS(csrf);

  loadPlayersFromServer();
};

var loadPlayersFromServer = function loadPlayersFromServer() {
  console.log('got from server');
  sendAjax('GET', '/getUsername', null, function (data) {
    name = data;
    console.log(name);
  });
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  sok();
  gameCheck();
  getToken();
});
'use strict';

var handleError = function handleError(message) {
  console.log('there is an error');
  $('#errorMessage').text(message);
  $('#playerMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#playerMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
