const { Schema, model } = require('mongoose');

// Utility function to generate the server-specific collection name
function getServerCollectionName(Guild) {
    return Guild;
  }

const MemberLogSchema = new Schema({
  Guild: String,
  Roles: [String], // array of role IDs
  Channels: {
    ApplicationChannel: String,
    ModAppChannel: String,
    // add other channel fields as needed
  }
});

module.exports = (Guild) => model(getServerCollectionName(Guild), MemberLogSchema);