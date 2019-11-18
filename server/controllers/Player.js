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
  console.log('created');
  const playerData = {
    name: req.session.account.username,
    wins: 0,
    losses: 0,
    money: 0,
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

const updateWins = (request, response) => {
  const req = request;
  const res = response;

  return Player.PlayerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    const namer = { name: docs[0].name };
    return Player.PlayerModel.update(namer, { $inc: { wins: 1 } }, {}, (error) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.status(200).json({ error: 'wins have changed' });
    });
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


// const addMoney = (request, response) => {
//   const req = request;
//   const res = response;

//   // const filter = { name: req.session.account.username };
//   // const update = { money: 400 };
//   // const test = Player.PlayerModel.findOneAndUpdate(filter, update, {
//   //   new: true,
//   // });
//   // console.log(test);

//   console.log(req.Player);
//   return Player.PlayerModel.update(req.session.account.name,
//     { $set: { money: 400 } },
//     {}, (errors) => {
//       if (errors) {
//         return res.status(500).json({ error: 'unable to change money' });
//       }
//       return res.status(200).json({ redirect: '/maker' });
//     });
//   // req.body.playerMoney = `${req.body.playerMoney}`;
//   // return res.status(400).json({ error: 'req.body.playerMoney' });
//   // const testM = `${req.session.Player.money}`;
//   // const combo = req.body.playerMoney + testM;
//   // if (!req.body.playerMoney) {
//   //   return res.status(400).json({ error: 'All fields are required' });
//   // }
//   // const findUser = {
//   //   username: req.session.account._id,
//   // };
//   // return Player.PlayerModel.update(findUser, { $set: { money: req.body.playerMoney } }, {}
//   // , (errors) => {
//   //   if (errors) {
//   //     return res.status(500).json({ error: 'unable to change money' });
//   //   }
//   //   return res.status(200).json({ redirect: '/maker' });
//   // });
// };

// module.exports.addMoney = addMoney;
module.exports.getUserList = getUserList;
module.exports.update = updateWins;
module.exports.makerPage = makerPage;
module.exports.getPlayer = getPlayer;
module.exports.make = makePlayer;
