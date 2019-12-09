const models = require('../models');
const Lobby = models.Lobby;

const lobbyPage = (req, res) => {
  const lobbyL = Lobby.LobbyModel;
  return res.render('lobbyList', { csrfToken: req.csrfToken(), lobby: lobbyL });
};


const makeLobby = (req, res) => {
  console.log('created');
  const LobbyData = {
    name: req.body.name,
  };

  const newLobby = new Lobby.LobbyModel(LobbyData);

  const lobbyPromise = newLobby.save();

  lobbyPromise.then(() => res.json({ redirect: '/maker' }));

  lobbyPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Lobby name is already in use' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return lobbyPromise;
};

const getLobbys = (request, response) => {
  const req = request;
  const res = response;
  const lobbyL = Lobby.LobbyModel.findAllLobbys();
  console.log(lobbyL);
  return res.json({ lobbys: lobbyL });
};

module.exports.makeLobby = makeLobby;
module.exports.getLobbys = getLobbys;
module.exports.lobbyPage = lobbyPage;
