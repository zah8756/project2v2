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
    unique: true,
  },
  anchor: {
    type: Number,
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

LobbySchema.statics.toAPI = (doc) => ({
  name: doc.name,
  _id: doc._id,
  anchor: doc.anchor,
});

LobbySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return LobbyModel.find(search).select('name').exec(callback);
};

LobbySchema.statics.findAllLobbys = (given, callback) => {
  const search = {
    owner: given,
  };
  return LobbyModel.find(search).select('name').exec(callback);
};

LobbySchema.statics.deleteById = (id, callback) => {
  const search = {
    _id: convertId(id),
  };

  return LobbyModel.findOneAndRemove(search).exec(callback);
};

LobbyModel = mongoose.model('Lobby', LobbySchema);

module.exports.LobbyModel = LobbyModel;
module.exports.LobbySchema = LobbySchema;
