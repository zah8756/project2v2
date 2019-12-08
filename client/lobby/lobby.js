const socket = io();

const handleMakeLobby = (e) => {
    e.preventDefault();

    $('#playerMessage').animate({width:'hide'}, 350);

    if($('#lobbyName').val() == '') {
        handleError('a lobby name is required');
        return false;
    }

    sendAjax('POST', $('#lobbyForm').attr('action'), $('#lobbyForm').serialize(), () => {
        loadLobbysFromServer();
    });

    return false;
};


const LobbyForm = (props) => {
    return (
        <form id='lobbyForm'
        name='lobbyForm'
        action='/maker'
        method='POST'
        className='lobbyForm' >
            <label htmlFor='name'>Lobby Name: </label>
            <input id='lobbyName' type='text' name='name' placeholder='Lobby Name' />
            <input id='csrftoken' type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeLobbySubmit' type='submit' value='Make Lobby' />
        </form>
    );
};

const LobbyList = (props) => {
    if(props.lobbys.length === 0) {
        return (
            <div className='lobbysList'>
                <h3 className='emptyDomo'>No lobbies currently open</h3>
            </div>
        );
    }

    const lobbyNodes = props.lobbys.map(function(lobby) {
        return (
            <div key={lobby._id} className='lobby'>
                <img src='/assets/img/fistBump.png' alt='fistBump' className='fistBump'/>
                <h3 className='domoName'> Name: {lobby.name} </h3>
            </div>
        );
    });

    return (
        <div className='lobbyList'>
            {lobbyNodes}
        </div>
    );
};

const loadlobbiesFromServer = () => {
    sendAjax('GET', '/getlobbies', null, (data) => {
        ReactDOM.render(
            <LobbyList lobbys={data.lobbys} />, document.querySelector('#lobbyList')
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <LobbyForm csrf={csrf}/>, document.querySelector('#makeLobby')
    );

    ReactDOM.render(
        <LobbyList lobbys={[]}/>, document.querySelector('#lobbys')
    );

    loadlobbiesFromServer();
};



const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});