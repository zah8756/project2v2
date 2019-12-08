const models = require('../models');
const Lobby = models.Lobby;

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


module.exports.makeLobby = makeLobby;
