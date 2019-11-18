'use strict';

// const handlePlayerMoney = (e) => {
//     e.preventDefault();

//     $('#playerMessage').animate({width:'hide'}, 350);

//     if($('#playerMoney').val() == '') {
//         handleError('All fields are required');
//         return false;
//     }

//     sendAjax('POST', '/maker', $('#moneyForm').serialize(), () => {
//         handleError('money has changed');
//     });

//     return false;
// };


// const MoneyForm = (props) => {
//     return (
//         <form id='moneyForm'
//         onSubmit={handlePlayerMoney}
//         name='moneyForm'
//         action='/addMoney'
//         method='GET'
//         className='playerForm' >
//             {/* <label htmlFor='fName'>First Name: </label>
//             <input id='playerFName' type='text' name='fName' placeholder='Player First Name' />
//             <label htmlFor='lName'>Last Name: </label>
//             <input id='playerLName' type='text' name='lName' placeholder='Player Last Name' />
//             <label htmlFor='level'>Card Number: </label>
//             <input id='playerCardNumber' type='text' name='cNumber' placeholder='Player Card Number' />
//             <label htmlFor='money'>Deposit Amount: </label> */}
//             <input id='playerMoney' type='text' name='money' placeholder='Player Money' />
//             <input type='hidden' name='_csrf' value={props.csrf} />
//             <input className='moneySubmit' type='submit' value='input money' />
//         </form>
//     );
// };

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

// const setup = (csrf) => {
//     ReactDOM.render(
//         <MoneyForm csrf={csrf} />, document.querySelector('#moneyForm')
//     );
// };

// const getToken = () => {
//     sendAjax('GET', '/getToken', null, (result) => {
//         setup(result.csrfToken);
//     });
// };

// $(document).ready(function() {
//     getToken();
// });

var handlePlayer = function handlePlayer(e) {
    e.preventDefault();

    $('#playerMessage').animate({ width: 'hide' }, 350);

    if ($('#playerName').val() == '' || $('#playerWins').val() == '' || $('#playerLosses').val() == '' || $('#playerMoney').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }

    sendAjax('POST', $('#playerForm').attr('action'), $('#playerForm').serialize(), function () {
        handleError('money has changed');
    });

    return false;
};

var PlayerForm = function PlayerForm(props) {
    return React.createElement(
        'form',
        { id: 'playerForm',
            onSubmit: handlePlayer,
            name: 'playerForm',
            action: '/addMoney',
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
            'wins: '
        ),
        React.createElement('input', { id: 'playerWins', type: 'text', name: 'wins', placeholder: 'Player wins' }),
        React.createElement(
            'label',
            { htmlFor: 'level' },
            'losses: '
        ),
        React.createElement('input', { id: 'playerLosses', type: 'text', name: 'losses', placeholder: 'Player losses' }),
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

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PlayerForm, { csrf: csrf }), document.querySelector('#moneyForm'));
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
