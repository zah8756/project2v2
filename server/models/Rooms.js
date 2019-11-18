const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const roomId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const _ = require('underscore');
const roomModel = {};

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  capacity: {
    type: Number,
    min: 0,
    required: true,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

RoomSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  capacity: doc.wins,
});

const Message = mongoose.model('Room', RoomSchema);

module.exports = Message;
