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

// creates a new player
const makePlayer = (req, res) => {
  console.log('created');
  const playerData = {
    name: req.session.account.username,
    wins: 0,
    losses: 0,
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

// gets a list of all players

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


// checks who won the round then gives that player a point in their win property
const updateWins = (request, response) => {
  const req = request;
  const res = response;

  const namer = { name: req.body.playerN };
  return Player.PlayerModel.update(namer, { $inc: { wins: 1 } }, {}, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.status(200).json({ error: 'wins have changed' });
  });
};

// checks to see who lost then changes incriments thier losses propery by 1
const updateLosses = (request, response) => {
  const req = request;
  const res = response;

  const namer = { name: req.body.playerN };
  return Player.PlayerModel.update(namer, { $inc: { losses: 1 } }, {}, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.status(200).json({ error: 'wins have changed' });
  });
};

const getUserList = (request, response) => {
  const req = request;
  const res = response;

  return Player.PlayerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const list = docs.count;
    console.log(list);
    res.json(list);
    return res.status(200).json({ error: 'got list' });
  });
};


module.exports.updateLosses = updateLosses;
module.exports.getUserList = getUserList;
module.exports.update = updateWins;
module.exports.makerPage = makerPage;
module.exports.getPlayer = getPlayer;
module.exports.make = makePlayer;
