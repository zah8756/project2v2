'use strict';

var socket = io();

var handleMakeLobby = function handleMakeLobby(e) {
    e.preventDefault();

    $('#playerMessage').animate({ width: 'hide' }, 350);

    if ($('#lobbyName').val() == '') {
        handleError('a lobby name is required');
        return false;
    }

    sendAjax('POST', '/makeLobby', $('#lobbyForm').serialize(), function () {
        loadlobbiesFromServer();
    });

    return false;
};

var LobbyForm = function LobbyForm(props) {
    return React.createElement(
        'form',
        { id: 'lobbyForm',
            name: 'lobbyForm',
            onSubmit: handleMakeLobby,
            action: '',
            method: 'POST',
            className: 'lobbyForm' },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Lobby Name: '
        ),
        React.createElement('input', { id: 'lobbyName', type: 'text', name: 'name', placeholder: 'Lobby Name' }),
        React.createElement('input', { id: 'csrftoken', type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeLobbySubmit', type: 'submit', value: 'Make Lobby' })
    );
};

var LobbyList = function LobbyList(props) {
    if (props.lobbys.length === 0) {
        return React.createElement(
            'div',
            { className: 'lobbysList' },
            React.createElement(
                'h3',
                { className: 'emptyDomo' },
                'No lobbies currently open'
            )
        );
    }

    var lobbyNodes = props.lobbys.map(function (lobby) {
        return React.createElement(
            'div',
            { key: lobby._id, className: 'lobby' },
            React.createElement('img', { src: '/assets/img/fistBump.png', alt: 'fistBump', className: 'fistBump' }),
            React.createElement(
                'h3',
                { className: 'domoName' },
                ' Name: ',
                lobby.name,
                ' '
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'lobbyList' },
        lobbyNodes
    );
};

var loadlobbiesFromServer = function loadlobbiesFromServer() {
    sendAjax('GET', '/getLobbys', null, function (data) {
        console.log(data);
        ReactDOM.render(React.createElement(LobbyList, { lobbys: data.lobbys }), document.querySelector('#lobbyList'));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(LobbyForm, { csrf: csrf }), document.querySelector('#makeLobby'));

    ReactDOM.render(React.createElement(LobbyList, { lobbys: [] }), document.querySelector('#lobbys'));

    loadlobbiesFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
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
