
const PlayerForm = (props) => {
    return (
        <form id='playerForm'
        name='playerForm'
        action='/maker'
        method='POST'
        className='playerForm' >
            <input id='csrftoken' type='hidden' name='_csrf' value={props.csrf} />
        </form>
    );
};
//creates a new player only if no other player ahs been created 
const PlayerList = function(props) {
    if(props.players.length === 0) {
        return (
            <div className='playerList'>
                <h3 className='emptyplayer'>No Players loaded Yet</h3>
            </div>
        );
    }

    const playerNodes = props.players.map(function(player) {
        return (
            <div key={player._id} className='player'>
                <img src='/assets/img/fistBump.png' alt='fistBump' className='fistBump'/>
                <h3 className='playerName'> Name: {player.name} </h3>
                <h3 className='playerAge'> Wins: {player.wins} </h3>
                <h3 className='playerLevel'> Losses: {player.losses} </h3>
            </div>
        );
    });

    return (
        <div className='playerList'>
            {playerNodes}
        </div>
    );
};

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
        <PlayerList players={[]}/>, document.querySelector('#players')
    );

     //loads our player on startup    
    sendAjax('GET', '/getPlayer', `_csrf=${document.querySelector('#csrftoken').value}`, (data) => {
        if (data.players.length==0){
            sendAjax('POST', '/maker',`_csrf=${document.querySelector('#csrftoken').value}`, function() {
                loadPlayersFromServer();
            });
        };
    });

        
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