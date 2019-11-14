'use strict';

var handlePlayer = function handlePlayer(e) {
    e.preventDefault();

    $('#playerMessage').animate({ width: 'hide' }, 350);

    if ($('#playerName').val() == '' || $('#playerAge').val() == '' || $('#playerLevel').val() == '' || $('#playerMoney').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }

    sendAjax('POST', $('#playerForm').attr('action'), $('#playerForm').serialize(), function () {
        loadPlayersFromServer();
    });

    return false;
};

var PlayerForm = function PlayerForm(props) {
    return React.createElement(
        'form',
        { id: 'playerForm',
            onSubmit: handlePlayer,
            name: 'playerForm',
            action: '/maker',
            method: 'POST',
            className: 'playerForm' },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Name: '
        ),
        React.createElement('input', { id: 'playerName', type: 'text', name: 'name', placeholder: 'Player Name' }),
        React.createElement(
            'label',
            { htmlFor: 'age' },
            'Age: '
        ),
        React.createElement('input', { id: 'playerAge', type: 'text', name: 'age', placeholder: 'Player Age' }),
        React.createElement(
            'label',
            { htmlFor: 'level' },
            'Level: '
        ),
        React.createElement('input', { id: 'playerLevel', type: 'text', name: 'level', placeholder: 'Player Level' }),
        React.createElement(
            'label',
            { htmlFor: 'money' },
            'Money: '
        ),
        React.createElement('input', { id: 'playerMoney', type: 'text', name: 'money', placeholder: 'Player Money' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makePlayerSubmit', type: 'submit', value: 'Make Player' })
    );
};

var PlayerList = function PlayerList(props) {
    if (props.players.length === 0) {
        return React.createElement(
            'div',
            { className: 'playerList' },
            React.createElement(
                'h3',
                { className: 'emptyplayer' },
                'No Players Yet'
            )
        );
    }

    var playerNodes = props.players.map(function (player) {
        return React.createElement(
            'div',
            { key: player._id, className: 'player' },
            React.createElement('img', { src: '/assets/img/domoFace.jpeg', alt: 'player face', className: 'domoFace' }),
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
                ' Age: ',
                player.age,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'playerLevel' },
                ' Level: ',
                player.level,
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
