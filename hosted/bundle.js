'use strict';

var PlayerForm = function PlayerForm(props) {
    return React.createElement(
        'form',
        { id: 'playerForm',
            name: 'playerForm',
            action: '/maker',
            method: 'POST',
            className: 'playerForm' },
        React.createElement('input', { id: 'csrftoken', type: 'hidden', name: '_csrf', value: props.csrf })
    );
};
//creates a new player only if no other player ahs been created 
var PlayerList = function PlayerList(props) {
    if (props.players.length === 0) {
        return React.createElement(
            'div',
            { className: 'playerList' },
            React.createElement(
                'h3',
                { className: 'emptyplayer' },
                'No Players loaded Yet'
            )
        );
    }

    var playerNodes = props.players.map(function (player) {
        return React.createElement(
            'div',
            { key: player._id, className: 'player' },
            React.createElement('img', { src: '/assets/img/fistBump.png', alt: 'fistBump', className: 'fistBump' }),
            React.createElement(
                'h3',
                { className: 'playerName' },
                ' Name: ',
                player.name,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'playerAge' },
                ' Wins: ',
                player.wins,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'playerLevel' },
                ' Losses: ',
                player.losses,
                ' '
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'playerList' },
        playerNodes
    );
};

var loadPlayersFromServer = function loadPlayersFromServer() {
    sendAjax('GET', '/getPlayer', null, function (data) {
        ReactDOM.render(React.createElement(PlayerList, { players: data.players }), document.querySelector('#players'));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PlayerForm, { csrf: csrf }), document.querySelector('#makePlayer'));

    ReactDOM.render(React.createElement(PlayerList, { players: [] }), document.querySelector('#players'));

    //loads our player on startup    
    sendAjax('GET', '/getPlayer', '_csrf=' + document.querySelector('#csrftoken').value, function (data) {
        if (data.players.length == 0) {
            sendAjax('POST', '/maker', '_csrf=' + document.querySelector('#csrftoken').value, function () {
                loadPlayersFromServer();
            });
        };
    });

    loadPlayersFromServer();
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
