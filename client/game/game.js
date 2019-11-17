const socket = io();
let submitted = false;
let user ='test';
// let currentUser = req.session.account.username;

const handleText = (e) =>{
  e.preventDefault(); // prevents page reloading
  console.log('clap');
  socket.emit('chat message', $('#m').val());
  $('#m').val('');

  // sok();
  return false;
}

const sok = () => {
  socket.on ('chat message', (msg) => {
    console.log('activated');
    
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0,document.body.scrollHeight);
  });
}

const handleRPS = (e) => {
  e.preventDefault();
  console.log ("activated");
  const userChoice = $('input[name=choice]:checked').val();
  if(!submitted)
  {
      submitted = true;
      socket.emit('player choice',user, userChoice);//change current user to the current userers name not sure how though 
      $('#info').html('Waiting for the other players decision');//need to get rid of this or put the text onto another line 
  }
  else $('#info').html('You can not change your decision');

  return false;
}



const gameCheck = () => {
    socket.on('tie', function () {
      $('#info').append($('<li>').text('A tie!'));
      submitted = false;
  });

  socket.on('player 1 wins', function (user) {
      $('#info').append($('<li>').text(`${user[0].userName} wins!`));
    submitted = false;
  });

  socket.on('player 2 wins', function (user) {
  $('#info').append($('<li>').text(`${user[1].userName} wins!`));
  submitted = false;
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
          <input className='buttonSend' type='submit' value='Send' />
      </form>
  );
};

const RPSForm = (props) => {
  return(
    <form id='RPSForm'
    onSubmit={handleRPS}
    action=''
    name='RPSForm'
    method='POST'>
    
      <input id="rock" type="radio" name="choice" value="rock" checked />
      <label htmlFor="rock">Rock</label>
      <br />
      <input id="paper" type="radio" name="choice" value="paper" />
      <label htmlFor="paper">Paper</label>
      <br />

      <input id="scissors" type="radio" name="choice" value="scissors" />
      <label htmlFor="scissors">Scissors</label>
      <br/>    

      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='gameButton' type='submit' value='make decision' />
    </form>
  );
}


const setup = function(csrf) {
  ReactDOM.render(
      <GameForm csrf={csrf}/>, document.querySelector('#sender')
  );
  ReactDOM.render(
    <RPSForm csrf={csrf}/>, document.querySelector('#RPS')
  )

  loadPlayersFromServer();
};

const loadPlayersFromServer = () => {
  console.log('got from server');
  sendAjax('GET', '/getUsername', null, (data) => {
      user = data
      console.log(user);
  });
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
      setup(result.csrfToken);
  });
};

$(document).ready(function() {
  sok();
  gameCheck();
  getToken();
});
