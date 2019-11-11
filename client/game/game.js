const socket = io();

// const handleText = (e) =>{
//   e.preventDefault(); // prevents page reloading
//   socket.emit('chat message', $('#m').val());
//   $('#m').val('');
//   return false;
// }


//   socket.on ('chat message', (msg) => {
//     console.log('activated');
//     // $('#messages').append($('<li>').text(msg));
//     // window.scrollTo(0, document.body.scrollHeight);
//     socket.broadcast.emit("received", { message: msg  });
//   });


// const GameForm = () => {
//   return (
//       <form id='messageForm'
//       onSubmit={handleText}
//       name='messageForm'
//       action='/chat'
//       method='POST'>
//           <input id="m" type='text' autocomplete="off" />
//           {/* <input type='hidden' name='_csrf' value={props.csrf} /> */}
//           <input className='buttonSend' type='submit' value='Send' />
//       </form>
//   );
// };

// const setup = function() {
//   ReactDOM.render(
//       <GameForm/>, document.querySelector('#sender')
//   );

//   // ReactDOM.render(
//   //     <GameListP gList={[]}/>, document.querySelector('#mesages')
//   // );
// };

// const getToken = () => {
//   sendAjax('GET', '/getToken', null, (result) => {
//       setup(result.csrfToken);
//   });
// };

// $(document).ready(function() {
//   getToken();
// });

$(() => {
  $('#send').click(() => {
    sendMessage({ name: $('#name').val(), message: $('#message').val() });
  });
  getMessages();
});
socket.on('message', addMessages);

function addMessages(message) {
  $('#messages').append(`<h4> ${message.name} </h4> <p> ${message.message} </p>`);
}

function getMessages() {
  $.get('http://localhost:3000/messages', (data) => {
    data.forEach(addMessages);
  });
}
function sendMessage(message) {
  $.post('http://localhost:3000/messages', message);
}
