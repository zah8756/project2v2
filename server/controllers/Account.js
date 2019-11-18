const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const gamePage = (req, res) => {
  res.render('game');
};

const passPage = (req, res) => {
  res.render('passChange');
};

const moneyPage = (req, res) => {
  res.render('money', { csrfToken: req.csrfToken() });
};

const missingPage = (req, res) => {
  res.render('404', { csrfToken: req.csrfToken() });
};

// const signupPage = (req, res) => {
//   res.render('signup', { csrfToken: req.csrfToken() });
// };

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws;
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      money: 0,
    };


    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();


    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.oldPass = `${req.body.oldPass}`;
  req.body.newPass1 = `${req.body.newPass1}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  if (!req.body.oldPass || !req.body.newPass1 || !req.body.newPass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.newPass1 !== req.body.newPass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (req.body.oldPass === req.body.newPass1) {
    return res.status(400).json({ error: 'you can not use your old password' });
  }

  return Account.AccountModel.authenticate(`${req.session.account.username}`, req.body.oldPass,
  (err, password) => {
    if (err || !password) {
      return res.status(401).json({ error: 'old password is incorrect' });
    }

    return Account.AccountModel.generateHash(req.body.newPass1, (salt, hash) => {
      const findUser = {
        username: req.session.account.username,
      };

      Account.AccountModel.update(findUser, { $set: { password: hash, salt } }, {}, (errors) => {
        if (errors) {
          return res.status(500).json({ error: 'unable to change password' });
        }
        return res.status(200).json({ redirect: '/maker' });
      });
    });
  }
);
};
const getUsername = (request, response) => {
  const req = request;
  const res = response;
  const username = req.session.account.username;
  console.log(username);
  res.json(username);
};

const addMoney = (request, response) => {
  const req = request;
  const res = response;

  const findUser = {
    username: req.session.account.username,
  };

  return Account.AccountModel.update(findUser,
    { $inc: { money: 55 } }, { }, (errors) => {
      console.log(errors);
      if (errors) {
        return res.status(500).json({ error: 'unable to change money' });
      }
      console.log(req.session.account);
      return res.status(200).json({ redirect: '/maker' });
    });

  // console.log(req.session.account);
  // const filter = { username: req.session.account.username };
  // const update = { money: 20 };
  // const test = Account.AccountModel.findOneAndUpdate(filter, update);
  // console.log(Account);
  // return test;
  // const findUser = {
  //   username: req.session.account.username,
  // };

  // req.body.playerMoney = `${req.body.playerMoney}`;

  // console.log(req.session.account);
  // return Account.AccountModel.update(findUser,
  //  { money: 20 },
  //   {}, (errors) => {
  //     console.log(errors);
  //     if (errors) {
  //       return res.status(500).json({ error: 'unable to change money' });
  //     }
  //     console.log(req.session.account);
  //     return res.status(200).json({ redirect: '/maker' });
  //   });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};
module.exports.addMoney = addMoney;
module.exports.getUsername = getUsername;
module.exports.moneyPage = moneyPage;
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.gamePage = gamePage;
module.exports.changePassword = changePassword;
module.exports.passPage = passPage;
module.exports.missingPage = missingPage;
// module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.getToken = getToken;
