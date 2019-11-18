const handlePlayer = (e) => {
    e.preventDefault();

    $('#playerMessage').animate({width:'hide'}, 350);

    if($('#playerName').val() == '' || $('#playerWins').val() == '' || $('#playerLosses').val() == '' || $('#playerMoney').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }

    sendAjax('POST', $('#playerForm').attr('action'), $('#playerForm').serialize(), function() {
        loadPlayersFromServer();
    });

    return false;
};

const handleUpdate = (e) => {
    e.preventDefault();

    sendAjax('POST', $('#updateB').attr('action'), $('#updateB').serialize(), () => {
        handleError('UPDATE');
    });

    return false;
};


const PlayerForm = (props) => {
    return (
        <form id='playerForm'
        onSubmit={handlePlayer}
        name='playerForm'
        action='/maker'
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

const PlayerList = function(props) {
    if(props.players.length === 0) {
        return (
            <div className='playerList'>
                <h3 className='emptyplayer'>No Players Yet</h3>
            </div>
        );
    }

    const playerNodes = props.players.map(function(player) {
        return (
            <div key={player._id} className='player'>
                <img src='/assets/img/domoFace.jpeg' alt='player face' className='domoFace'/>
                <h3 className='playerName'> Name: {player.name} </h3>
                <h3 className='playerAge'> Wins: {player.wins} </h3>
                <h3 className='playerLevel'> Losses: {player.losses} </h3>
                <h3 className='playerMoney'> Money: {player.money} </h3>
            </div>
        );
    });

    return (
        <div className='playerList'>
            {playerNodes}
        </div>
    );
};

const UpdateB = (props) =>{
    return(
    <form id='updateB'
    onSubmit={handleUpdate}
    name='updateB'
    action='/update'
    method='POST'
    className='updateB' >
        <input type='hidden' name='_csrf' value={props.csrf} />
        <input className='update' type='submit' value='Make Player' />
    </form>
    );
}

const loadPlayersFromServer = () => {
    sendAjax('GET', '/getPlayer', null, (data) => {
        ReactDOM.render(
            <PlayerList players={data.players} />, document.querySelector('#players')
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <PlayerForm csrf={csrf}/>, document.querySelector('#makePlayer')
    );

    ReactDOM.render(
        <UpdateB csrf={csrf}/>, document.querySelector('#update')
    );

    ReactDOM.render(
        <PlayerList players={[]}/>, document.querySelector('#players')
    );

    loadPlayersFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});