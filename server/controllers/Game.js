const models = require('../models');
const Message = models.Message;
const app = require('../app');
const io = app.io;

// const message = (request, response) => {
//   const req = request;
//   const res = response;

//   Message.find({}, (err, messages) => res.send(messages));
// };

// const messageUser = (request, response) => {
//   const req = request;
//   const res = response;

//   const user = req.params.user;
//   Message.find({ name: user }, (err, messages) => {
//     res.send(messages);
//   });
// };
const chat = (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }
  const messageData = {
    message: req.body.message,
    sender: 'test',
  };

  const newMessage = new Message.MessageModel(messageData);

  const messagePromise = newMessage.save();

  messagePromise.then(() => res.json({ redirect: '/maker' }));

  messagePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'sender name already in use' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return messagePromise;
};


const messager = (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
};

const pMessager = (req, res) => {
  const message = new Message(req.body);
  message.save((err) => {
    if (err) {
      res.status(500).json({ error: 'internal error' });
    }
    io.emit('message', req.body);
    res.sendStatus(200);
  });
};


module.exports.chat = chat;
module.exports.messager = messager;
module.exports.pMessager = pMessager;

