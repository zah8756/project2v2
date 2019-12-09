const models = require('../models');
const Lobby = models.Lobby;

const lobbyPage = (request, response) => {
  const req = request;
  const res = response;
  return Lobby.LobbyModel.findAllLobbys(req.body.anchor, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('lobbyList', { csrfToken: req.csrfToken(), lobby: docs });
  });
};

const gamePage = (req, res) => {
  res.render('game', { lName: req.body.name });
};


const makeLobby = (req, res) => {
  console.log('created');
  const LobbyData = {
    name: req.body.name,
    anchor: 1,
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
  return Lobby.LobbyModel.findAllLobbys(req.body.anchor, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ lobbys: docs });
  });
};

module.exports.makeLobby = makeLobby;
module.exports.getLobbys = getLobbys;
module.exports.lobbyPage = lobbyPage;
module.exports.gamePage = gamePage;
