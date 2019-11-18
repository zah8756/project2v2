const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPlayer', mid.requiresSecure, controllers.Player.getPlayer);// change
  app.get('/checkMoney', mid.requiresSecure, controllers.Account.moneyPage);
  app.get('/game', mid.requiresSecure, controllers.Account.gamePage);
  // app.get('/messages', mid.requiresSecure, controllers.Game.messager);
  // app.post('/messages', mid.requiresSecure, controllers.Game.pMessager);
  app.get('/getUsername', mid.requiresSecure, controllers.Account.getUsername);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin
  , controllers.Account.changePassword);
  app.post('/addMoney', mid.requiresSecure, mid.requiresLogin, controllers.Account.addMoney);
  app.get('/passPage', mid.requiresSecure, controllers.Account.passPage);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  // app.post('/chat', mid.requiresLogin, controllers.Game.chat);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/update', mid.requiresSecure, controllers.Player.update);
  app.post('/updateLosses', mid.requiresSecure, controllers.Player.updateLosses);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/getUserList', mid.requiresLogin, controllers.Player.getUserList);
  app.get('/maker', mid.requiresLogin, controllers.Player.makerPage);// change
  app.post('/maker', mid.requiresLogin, controllers.Player.make);// change
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, mid.requiresLogin, controllers.Account.missingPage);
};


module.exports = router;
