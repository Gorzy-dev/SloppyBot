const mongoose = require("mongoose");

const ModAppSchema = new mongoose.Schema({

  user: {
    type: String,
    required: true,
  },

  guildID: {
    type: String,
    required: true,
  },

  modAppChannel: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model("ModApps", ModAppSchema);