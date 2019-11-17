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

const handlePlayer = (e) => {
    
    $('#playerMessage').animate({width:'hide'}, 350);

    if($('#playerName').val() == '' || $('#playerWins').val() == '' || $('#playerLosses').val() == '' || $('#playerMoney').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }

    sendAjax('POST', $('#playerForm').attr('action'), $('#playerForm').serialize(), function() {
        handleError('money has changed');
    });

    return false;
};



const PlayerForm = (props) => {
    return (
        <form id='playerForm'
        onSubmit={handlePlayer}
        name='playerForm'
        action='/addMoney'
        method='POST'
        className='playerForm' >
            <label htmlFor='name'>Name: </label>
            <input id='playerName' type='text' name='name' placeholder='Player Name' />
            <label htmlFor='age'>wins: </label>
            <input id='playerWins' type='text' name='wins' placeholder='Player wins' />
            <label htmlFor='level'>losses: </label>
            <input id='playerLosses' type='text' name='losses' placeholder='Player losses' />
            <label htmlFor='money'>Money: </label>
            <input id='playerMoney' type='text' name='money' placeholder='Player Money' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makePlayerSubmit' type='submit' value='Make Player' />
        </form>
    );
};


const setup = function(csrf) {
    ReactDOM.render(
        <PlayerForm csrf={csrf}/>, document.querySelector('#moneyForm')
    );

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});