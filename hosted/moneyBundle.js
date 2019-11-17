'use strict';

var handlePlayerMoney = function handlePlayerMoney(e) {
    e.preventDefault();

    $('#playerMessage').animate({ width: 'hide' }, 350);

    if ($('#playerMoney').val() == '') {
        handleError('All fields are required');
        return false;
    }

    sendAjax('POST', '/addMoney', $('#moneyForm').serialize(), function () {
        handleError('money has changed');
    });

    return false;
};

var MoneyForm = function MoneyForm(props) {
    return React.createElement(
        'form',
        { id: 'moneyForm',
            onSubmit: handlePlayerMoney,
            name: 'moneyForm',
            action: '/addMoney',
            method: 'GET',
            className: 'playerForm' },
        React.createElement(
            'label',
            { htmlFor: 'fName' },
            'First Name: '
        ),
        React.createElement('input', { id: 'playerFName', type: 'text', name: 'fName', placeholder: 'Player First Name' }),
        React.createElement(
            'label',
            { htmlFor: 'lName' },
            'Last Name: '
        ),
        React.createElement('input', { id: 'playerLName', type: 'text', name: 'lName', placeholder: 'Player Last Name' }),
        React.createElement(
            'label',
            { htmlFor: 'level' },
            'Card Number: '
        ),
        React.createElement('input', { id: 'playerCardNumber', type: 'text', name: 'cNumber', placeholder: 'Player Card Number' }),
        React.createElement(
            'label',
            { htmlFor: 'money' },
            'Deposit Amount: '
        ),
        React.createElement('input', { id: 'playerMoney', type: 'text', name: 'money', placeholder: 'Player Money' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makePlayerSubmit', type: 'submit', value: 'input money' })
    );
};

// const PlayerList = function(props) {
//     if(props.players.length === 0) {
//         return (
//             <div className='playerList'>
//                 <h3 className='emptyplayer'>No Players Yet</h3>
//             </div>
//         );
//     }

//     const playerNodes = props.players.map(function(player) {
//         return (
//             <div key={player._id} className='player'>
//                 <img src='/assets/img/domoFace.jpeg' alt='player face' className='domoFace'/>
//                 <h3 className='playerName'> Name: {player.name} </h3>
//                 <h3 className='playerMoney'> Money:$ {player.money} </h3>
//             </div>
//         );
//     });

//     return (
//         <div className='playerList'>
//             {playerNodes}
//         </div>
//     );
// };


// const loadPlayersFromServer = () => {
//     sendAjax('GET', '/getPlayer', null, (data) => {
//         ReactDOM.render(
//             <PlayerList players={data.players} />, document.querySelector('#players')
//         );
//     });
// };

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(MoneyForm, { csrf: csrf }), document.querySelector('#moneyForm'));
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
