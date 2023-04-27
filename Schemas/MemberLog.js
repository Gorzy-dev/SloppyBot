// memberlog.js
const { Schema, model } = require('mongoose');

// Utility function to generate the server-specific collection name
function getServerCollectionName(serverId) {
  return `MemberLog_${serverId}`;
}

const MemberLogSchema = new Schema({
  Guild: String,
  userID: {
    type: String,
  },
  // Added the UserID field
  GuildName: String, // Changed from User to GuildName
  UserName: String, // Changed from level to UserName
  description: String,
  level: {
    type: Number,
    default: 1, // Set the default value for level to 1
  },
  xp: {
    type: Number,
    default: 0
  },
  totalxp: {
    type: Number,
    default: 0
  },  
  slopCoin:{
    type: Number,
    default: 0
  },
  lastMine:{
    type: Number,
    default: 0
  },
  Infractions: [{
    Type: String,
    IssuerID: String,
    IssuerTag: String,
    Reason: String,
    Date: Date,
  }],
  slimeJuggs: {
    type: Number,
    default: 0,
  }  
});

module.exports = (serverId) => model(getServerCollectionName(serverId), MemberLogSchema);
