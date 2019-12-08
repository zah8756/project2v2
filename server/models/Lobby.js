const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let LobbyModel = {};

const convertId = mongoose.Types.ObjectId;
const setLobbyName = (name) => _.escape(name).trim();

const LobbySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setLobbyName,
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

LobbySchema.statics.toAPI = (doc) => ({
  name: doc.name,
  _id: doc._id,
});

LobbySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return LobbyModel.find(search).select('name').exec(callback);
};

LobbyModel = mongoose.model('Lobby', LobbySchema);

module.exports.LobbyModel = LobbyModel;
module.exports.LobbySchema = LobbySchema;
