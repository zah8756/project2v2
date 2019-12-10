const models = require('../models');

const Account = models.Account;

// links us to most if not all of our pages
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const passPage = (req, res) => {
  res.render('passChange');
};

const gChat = (req, res) => {
  res.render('globalChat', { username: req.session.account.username });
};

const moneyPage = (req, res) => {
  res.render('money', { csrfToken: req.csrfToken() });
};

const missingPage = (req, res) => {
  res.render('404', { csrfToken: req.csrfToken() });
};

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
// changes our password to a new one
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.oldPass = `${req.body.oldPass}`;
  req.body.newPass1 = `${req.body.newPass1}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  // chekc our passwword to see if its valid and not the old password
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
    // creates a new password and a new hash
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
// reffrence to our username
const getUsername = (request, response) => {
  const req = request;
  const res = response;
  const username = req.session.account.username;
  res.json(username);
};

// creates csrf tokens for our clinet side to use
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.globalChat = gChat;
module.exports.getUsername = getUsername;
module.exports.moneyPage = moneyPage;
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
// module.exports.gamePage = gamePage;
module.exports.changePassword = changePassword;
module.exports.passPage = passPage;
module.exports.missingPage = missingPage;
module.exports.signup = signup;
module.exports.getToken = getToken;
