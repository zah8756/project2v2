const socket = io();
let submitted = false;
let name ='test';
//reads our text then using socket sends it to the server to be displayed 
const handleText = (e) =>{
  e.preventDefault(); // prevents page reloading
  console.log('clap');
  socket.emit('chat message', $('#username').val() +" : "+ $('#m').val());
  $('#m').val('');

  return false;
}
//connects us to our room would have done more with room but ran out of time 
const sok = () => {
  socket.on('connect', function() {
   socket.emit('room', 'test');
  });

  socket.on ('chat message', (msg) => {
    console.log('activated');
    
    $('#messages').append($('<li>').text(`${msg}`));
    window.scrollTo(0,document.body.scrollHeight);
  });
}


// chekcs what option we picked and send it to ther server then we get back the result in game check 
const handleRPS = (e) => {
  e.preventDefault();
  console.log ("activated");
  const userChoice = $('input[name=choice]:checked').val();
  if(!submitted)
  {
      submitted = true;
      socket.emit('player choice',name, userChoice);
      $('#info').html('Waiting for the other players decision');
  }
  else $('#info').html('You can not change your decision');

  return false;
}


//using the result of the game we determine the outcome
const gameCheck = () => {
    socket.on('tie', function () {
      $('#info').append($('<li>').text('A tie!'));
      submitted = false;
      setTimeout( () => {
        $('#info').html('Waiting for players input');
      }, 3000);
  });

  socket.on('player 1 wins', function (user) {
      $('#info').append($('<li>').text(`${user[0].userName} wins!`));
    submitted = false;
    if(user[0].userName === name){
      updateWins();
    }else{
      updateLosses();
    }
   
    setTimeout( () => {
      $('#info').html('Waiting for players input');
    }, 3000);
  });

  socket.on('player 2 wins', function (user) {
  $('#info').append($('<li>').text(`${user[1].userName} wins!`));
  submitted = false;
  if(user[1].userName === name){
    updateWins();
  }
  else{
    updateLosses();
  }
  setTimeout( () => {
    $('#info').html('Waiting for players input');
  }, 3000);
  });

  

}

//create the forms for our rps game and our global text

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

const RPSForm = (props) => {
  return(
    <form id='RPSForm'
    onSubmit={handleRPS}
    action=''
    name='RPSForm'
    method='POST'>
    
      <input id="rock" type="radio" name="choice" value="rock" checked />
      <label htmlFor="rock"><img id="rock" src="/assets/img/cRock.png" alt="rock logo"/></label>
      <br />
      <input id="paper" type="radio" name="choice" value="paper" />
      <label htmlFor="paper"><img id="paper" src="/assets/img/paper.png" alt="paper logo"/></label>
      <br />

      <input id="scissors" type="radio" name="choice" value="scissors" />
      <label htmlFor="scissors"><img id="scissors" src="/assets/img/scissors.png" alt="scissors logo"/></label>
      <br/>    

      <input id='csrftoken' type='hidden' name='_csrf' value={props.csrf} />
      <br />
      <input className='gameButton' id="submitButton" type='submit' value='make decision' />
    </form>
  );
}
//incriments whoever wins win value and updaLosses does the same with losses 
const updateWins = () => {
  sendAjax('POST','/update',`_csrf=${document.querySelector('#csrftoken').value}&playerN=${name}`, () => {

  });
};

const updateLosses = () => {
  sendAjax('POST','/updateLosses',`_csrf=${document.querySelector('#csrftoken').value}&playerN=${name}`, () => {
  
  });
}
const ifActive = (csrf) =>{
  if(document.querySelector('#sender')){
    ReactDOM.render(
      <GameForm csrf={csrf}/>, document.querySelector('#sender')
    );
  }
}
const ifRPS = (csrf) =>{
  if(document.querySelector('#RPS')){
    ReactDOM.render(
      <RPSForm csrf={csrf}/>, document.querySelector('#RPS')
    );
  }
}

const setup = function(csrf) {
  ifActive(csrf);
  ifRPS(csrf);

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
  gameCheck();
  getToken();
});
