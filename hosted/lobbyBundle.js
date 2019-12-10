'use strict';

var socket = io();
// make sure that any new lobby cannot have the same name as another loby 
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

//each lobby is created through this form 
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

//i created this form to allow for manual resting of the lobbies because currently they don't reload if another player creates one while you are on the same page
var ResetForm = function ResetForm(props) {
    return React.createElement(
        'form',
        { id: 'resetButton',
            name: 'resetButton',
            onSubmit: loadlobbiesFromServer,
            className: 'resetButton' },
        React.createElement('input', { id: 'csrftoken', type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeLobbySubmit', type: 'submit', id: 'reset', value: 'Reset Lobby List' })
    );
};

//we store all the lobbies inside this list 
var LobbyList = function LobbyList(props) {
    console.log(props);
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
            { key: lobby.anchor, className: 'lobby' },
            React.createElement('img', { src: '/assets/img/fistBump.png', alt: 'fistBump', className: 'fistBump' }),
            React.createElement(
                'h3',
                { className: 'lobbyName' },
                ' Lobby: ',
                lobby.name,
                ' '
            ),
            React.createElement(
                'div',
                { className: 'navlink', id: 'nav' },
                React.createElement(
                    'a',
                    { href: '/game?lobby=' + lobby.name },
                    'Join Lobby'
                )
            ),
            React.createElement(
                'button',
                { className: 'deleteLobby', onClick: deleteLobby },
                'X'
            ),
            React.createElement('input', { className: 'lobbyId', type: 'hidden', value: lobby._id })
        );
    });

    return React.createElement(
        'div',
        { className: 'lobbyList' },
        lobbyNodes
    );
};

//using this we pull the lobbies stored on the server onto our page 
var loadlobbiesFromServer = function loadlobbiesFromServer() {
    sendAjax('GET', '/getLobbys', null, function (data) {
        ReactDOM.render(React.createElement(LobbyList, { lobbys: data.lobbys }), document.querySelector('#lobbys'));
    });
};
// this command allows for the deletion of a lobby if i had more time i would have deleted them automatically once no one was in them 
var deleteLobby = function deleteLobby(e) {
    var id = e.target.parentElement.querySelector('.lobbyId').value;
    var _csrf = '' + document.querySelector('#csrftoken').value;

    sendAjax('DELETE', '/deleteLobby', { id: id, _csrf: _csrf }, function (data) {
        loadlobbiesFromServer();
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(LobbyForm, { csrf: csrf }), document.querySelector('#makeLobby'));

    ReactDOM.render(React.createElement(ResetForm, { csrf: csrf }), document.querySelector('#resetLobby'));

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
