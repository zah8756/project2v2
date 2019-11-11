const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  sender: {
    type: String,
  },
},
  {
    timestamps: true,
  });

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
