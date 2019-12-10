const socket = io();
// make sure that any new lobby cannot have the same name as another loby 
const handleMakeLobby = (e) => {
    e.preventDefault();

    $('#playerMessage').animate({width:'hide'}, 350);

    if($('#lobbyName').val() == '') {
        handleError('a lobby name is required');
        return false;
    }

    sendAjax('POST', '/makeLobby', $('#lobbyForm').serialize(), () => {
        loadlobbiesFromServer();
    });

    return false;
};


//each lobby is created through this form 
const LobbyForm = (props) => {
    return (
        <form id='lobbyForm'
        name='lobbyForm'
        onSubmit={handleMakeLobby}
        action=''
        method='POST'
        className='lobbyForm' >
            <label htmlFor='name'>Lobby Name: </label>
            <input id='lobbyName' type='text' name='name' placeholder='Lobby Name' />
            <input id='csrftoken' type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeLobbySubmit' type='submit' value='Make Lobby' />
        </form>
    );
};

//i created this form to allow for manual resting of the lobbies because currently they don't reload if another player creates one while you are on the same page
const ResetForm  = (props) =>{
    return (
        <form id='resetButton'
        name='resetButton'
        onSubmit={loadlobbiesFromServer}
        className='resetButton' >
            <input id='csrftoken' type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeLobbySubmit' type='submit' id='reset' value='Reset Lobby List' />
        </form>
    );
}

//we store all the lobbies inside this list 
const LobbyList = (props) => {
  console.log(props);
    if(props.lobbys.length === 0) {
        return (
            <div className='lobbysList'>
                <h3 className='emptyDomo'>No lobbies currently open</h3>
            </div>
        );
    }

    const lobbyNodes = props.lobbys.map(function(lobby) {
        return (
            <div key={lobby.anchor} className='lobby'>
                <img src='/assets/img/fistBump.png' alt='fistBump' className='fistBump'/>
                <h3 className='lobbyName'> Lobby: {lobby.name} </h3>
                <div className="navlink" id="nav">
                    <a href={`/game?lobby=${lobby.name}`}>Join Lobby</a>
                </div>
                <button className='deleteLobby' onClick={deleteLobby}>X</button>
                <input className='lobbyId'  type='hidden' value = {lobby._id}/>
            </div>
        );
    });

    return (
        <div className='lobbyList'>
            {lobbyNodes}
        </div>
    );
};

//using this we pull the lobbies stored on the server onto our page 
const loadlobbiesFromServer = () => {
    sendAjax('GET', '/getLobbys', null, (data) => {
        ReactDOM.render(
            <LobbyList lobbys={data.lobbys} />, document.querySelector('#lobbys')
        );
    });
};
// this command allows for the deletion of a lobby if i had more time i would have deleted them automatically once no one was in them 
const deleteLobby = (e) => {
	const id = e.target.parentElement.querySelector('.lobbyId').value;
	const _csrf=`${document.querySelector('#csrftoken').value}`;
	
	sendAjax('DELETE', '/deleteLobby', {id, _csrf}, data => {
		loadlobbiesFromServer();
	});
};


const setup = function(csrf) {
    ReactDOM.render(
        <LobbyForm csrf={csrf}/>, document.querySelector('#makeLobby')
    );

    ReactDOM.render(
        <ResetForm csrf={csrf}/>, document.querySelector('#resetLobby')
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