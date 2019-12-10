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
  console.log(`${req.query.lobby} this is the test name`);
  res.render('game', { lName: req.query.lobby });
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

const deleteLobby = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'lobby id is required to delete.' });
  }

  return Lobby.LobbyModel.deleteById(req.body.id, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'An error ocurred.' });
    }

    return res.status(200).json({ msg: 'lobby has been deleted successfully.' });
  });
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

module.exports.deleteLobby = deleteLobby;
module.exports.makeLobby = makeLobby;
module.exports.getLobbys = getLobbys;
module.exports.lobbyPage = lobbyPage;
module.exports.gamePage = gamePage;
