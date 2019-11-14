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
                <h3 className='playerMoney'> Money:$ {player.money} </h3>
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

const setup = function() {

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