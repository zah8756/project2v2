const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPlayer', mid.requiresSecure, controllers.Player.getPlayer);// change
  app.get('/checkMoney', mid.requiresSecure, controllers.Account.moneyPage);
  app.get('/game', mid.requiresSecure, controllers.Account.gamePage);
  app.get('/messages', mid.requiresSecure, controllers.Game.messager);
  app.post('/messages', mid.requiresSecure, controllers.Game.pMessager);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/chat', mid.requiresLogin, controllers.Game.chat);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Player.makerPage);// change
  app.post('/maker', mid.requiresLogin, controllers.Player.make);// change
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};


module.exports = router;
