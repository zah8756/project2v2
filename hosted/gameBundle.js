'use strict';

var socket = io();

var handleText = function handleText(e) {
  e.preventDefault(); // prevents page reloading
  console.log('clap');
  socket.emit('chat message', $('#m').val());
  $('#m').val('');

  // sok();
  return false;
};

var sok = function sok() {
  socket.on('chat message', function (msg) {
    console.log('activated');

    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
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

// const GameList = (props) => {

// }

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(GameForm, { csrf: csrf }), document.querySelector('#sender'));

  // ReactDOM.render(
  //     <GameListP gList={[]}/>, document.querySelector('#mesages')
  // );
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  sok();
  getToken();
});

// $(() => {
//   $('#send').click(() => {
//     sendMessage({ name: $('#name').val(), message: $('#message').val() });
//   });
//   getMessages();
// });
// socket.on('message', addMessages);

// function addMessages(message) {
//   $('#messages').append(`<h4> ${message.name} </h4> <p> ${message.message} </p>`);
// }

// function getMessages() {
//   $.get('http://localhost:3000/messages', (data) => {
//     data.forEach(addMessages);
//   });
// }
// function sendMessage(message) {
//   $.post('http://localhost:3000/messages', message);
// }
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
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
