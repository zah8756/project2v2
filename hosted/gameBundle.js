'use strict';

var socket = io();
var submitted = false;
var name = 'test';
// let currentUser = req.session.account.username;

var handleText = function handleText(e) {
  e.preventDefault(); // prevents page reloading
  console.log('clap');
  socket.emit('chat message', $('#m').val());
  $('#m').val('');

  // sok();
  return false;
};

var sok = function sok() {
  socket.on('connect', function () {
    // Connected, let's sign-up for to receive messages for this room
    socket.emit('room', 'test');
  });

  socket.on('chat message', function (msg) {
    console.log('activated');

    $('#messages').append($('<li>').text(name + ':' + msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
};

var handleRPS = function handleRPS(e) {
  e.preventDefault();
  console.log("activated");
  var userChoice = $('input[name=choice]:checked').val();
  if (!submitted) {
    submitted = true;
    socket.emit('player choice', name, userChoice);
    $('#info').html('Waiting for the other players decision');
  } else $('#info').html('You can not change your decision');

  return false;
};

var gameCheck = function gameCheck() {
  socket.on('tie', function () {
    $('#info').append($('<li>').text('A tie!'));
    submitted = false;
    setTimeout(function () {
      $('#info').html('Waiting for players input');
    }, 3000);
  });

  socket.on('player 1 wins', function (user) {
    $('#info').append($('<li>').text(user[0].userName + ' wins!'));
    submitted = false;
    if (user[0].userName === name) {
      updateWins();
    }

    setTimeout(function () {
      $('#info').html('Waiting for players input');
    }, 3000);
  });

  socket.on('player 2 wins', function (user) {
    $('#info').append($('<li>').text(user[1].userName + ' wins!'));
    submitted = false;
    if (user[1].userName === name) {
      updateWins();
    }
    setTimeout(function () {
      $('#info').html('Waiting for players input');
    }, 3000);
  });
};

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
    React.createElement('input', { className: 'buttonSend', type: 'submit', value: 'Send' })
  );
};

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
      'Rock'
    ),
    React.createElement('br', null),
    React.createElement('input', { id: 'paper', type: 'radio', name: 'choice', value: 'paper' }),
    React.createElement(
      'label',
      { htmlFor: 'paper' },
      'Paper'
    ),
    React.createElement('br', null),
    React.createElement('input', { id: 'scissors', type: 'radio', name: 'choice', value: 'scissors' }),
    React.createElement(
      'label',
      { htmlFor: 'scissors' },
      'Scissors'
    ),
    React.createElement('br', null),
    React.createElement('input', { id: 'csrftoken', type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'gameButton', type: 'submit', value: 'make decision' })
  );
};

var updateWins = function updateWins() {
  sendAjax('POST', '/update', '_csrf=' + document.querySelector('#csrftoken').value + '&playerN=' + name, function () {
    handleError('UPDATE');
  });
};

var updateLosses = function updateLosses() {
  sendAjax('POST', '/updateLosses', '_csrf=' + document.querySelector('#csrftoken').value, function () {
    handleError('UPDATE');
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(GameForm, { csrf: csrf }), document.querySelector('#sender'));
  ReactDOM.render(React.createElement(RPSForm, { csrf: csrf }), document.querySelector('#RPS'));

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
