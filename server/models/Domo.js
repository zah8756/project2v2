const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let PlayerModel = {};

// mongoose.types.objectID is a function that converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  level: {
    type: Number,
    min: 0,
    required: true,
  },

  money: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});


PlayerSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
  money: doc.money,
});

PlayerSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PlayerModel.find(search).select('name age level money').exec(callback);
};

PlayerModel = mongoose.model('Player', PlayerSchema);

module.exports.PlayerModel = PlayerModel;
module.exports.PlayerSchema = PlayerSchema;
