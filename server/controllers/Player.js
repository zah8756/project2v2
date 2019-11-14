const models = require('../models');
const Player = models.Player;

const makerPage = (req, res) => {
  Player.PlayerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), players: docs });
  });
};

const makePlayer = (req, res) => {
  if (!req.body.name || !req.body.wins || !req.body.losses || !req.body.money) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }
  const playerData = {
    name: req.body.name,
    wins: req.body.wins,
    losses: req.body.losses,
    money: req.body.money,
    owner: req.session.account._id,
  };

  const newPlayer = new Player.PlayerModel(playerData);

  const playerPromise = newPlayer.save();

  playerPromise.then(() => res.json({ redirect: '/maker' }));

  playerPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Player is already in use' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return playerPromise;
};

const getPlayer = (request, response) => {
  const req = request;
  const res = response;

  return Player.PlayerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ players: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getPlayer = getPlayer;
module.exports.make = makePlayer;
