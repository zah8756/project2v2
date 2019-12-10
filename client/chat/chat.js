const socket = io();

const handleText = (e) =>{
    e.preventDefault(); // prevents page reloading
    console.log('clap');
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  
    return false;
}
//changed how I find the player now it properly displays who typed what in chat 
const sok = () => {
    socket.on('connect', function() {
     socket.emit('room', 'test');
    });
    let messages = $('#messages');
  
    socket.on ('chat message', (msg) => {      
      messages.append($('<li>').text(`${name}: ${msg}`));
      console.log(messages[0]);
      $("#messages").animate({ scrollTop: $('#messages')[0].scrollHeight}, 500);
    });
  }
  

  const GameForm = (props) => {
    return (
        <form id='messageForm'
        onSubmit={handleText}
        name='messageForm'
        action=''
        method='POST'>
            <input id="m" type='text' autocomplete="off" />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input id="sButton" className='buttonSend' type='submit' value='Send' />
        </form>
    );
  };
  
  const ifActive = (csrf) =>{
    if(document.querySelector('#sender')){
      ReactDOM.render(
        <GameForm csrf={csrf}/>, document.querySelector('#sender')
      );
    }
  }

  const setup = function(csrf) {
    ifActive(csrf);
    loadPlayersFromServer();
  };
  
  //loads a player from the server on setup so aht we can grab their name 
  const loadPlayersFromServer = () => {
    console.log('got from server');
    sendAjax('GET', '/getUsername', null, (data) => {
        name = data
        console.log(name);
    });
  };
  
  const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
  };
  
  $(document).ready(function() {
    sok();
    getToken();
  });
  
