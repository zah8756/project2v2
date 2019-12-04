const socket = io();

const handleText = (e) =>{
    e.preventDefault(); // prevents page reloading
    console.log('clap');
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  
    return false;
}

const sok = () => {
    socket.on('connect', function() {
     socket.emit('room', 'test');
    });
  
    socket.on ('chat message', (msg) => {      
      $('#messages').append($('<li>').text(`${name}: ${msg}`));
      window.scrollTo(0,document.body.scrollHeight);
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
  
