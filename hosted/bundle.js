'use strict';

// const handlePlayer = (e) => {
//     e.preventDefault();

//     $('#playerMessage').animate({width:'hide'}, 350);

//     sendAjax('POST', $('#playerForm').attr('action'), $('#playerForm').serialize(), function() {
//         loadPlayersFromServer();
//     });

//     return false;
// };

var handleUpdate = function handleUpdate(e) {
    e.preventDefault();

    console.log($('#updateB').serialize());

    sendAjax('POST', $('#updateB').attr('action'), '_csrf=' + document.querySelector('#csrftoken').value, function () {
        handleError('UPDATE');
        loadPlayersFromServer();
    });

    return false;
};

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
            ),
            React.createElement(
                'h3',
                { className: 'playerMoney' },
                ' Money: ',
                player.money,
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

var UpdateB = function UpdateB(props) {
    return React.createElement(
        'form',
        { id: 'updateB',
            onSubmit: handleUpdate,
            name: 'updateB',
            action: '/update',
            method: 'POST',
            className: 'updateB' },
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'update', type: 'submit', value: 'Make Player' })
    );
};

var loadPlayersFromServer = function loadPlayersFromServer() {
    sendAjax('GET', '/getPlayer', null, function (data) {
        ReactDOM.render(React.createElement(PlayerList, { players: data.players }), document.querySelector('#players'));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PlayerForm, { csrf: csrf }), document.querySelector('#makePlayer'));

    ReactDOM.render(React.createElement(UpdateB, { csrf: csrf }), document.querySelector('#update'));

    ReactDOM.render(React.createElement(PlayerList, { players: [] }), document.querySelector('#players'));

    console.log(csrf);
    sendAjax('GET', '/getPlayer', '_csrf=' + document.querySelector('#csrftoken').value, function (data) {
        console.log(data);
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
