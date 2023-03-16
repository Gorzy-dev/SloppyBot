const {Schema, model} = require('mongoose')

module.exports = model("MemberLog", new Schema({
    Guild: String,
    UserID: Number,
    logChannel: String,
    memberRole: String,
    botRole: String,
    level: Number,
    xp: Number,
    totalxp: Number
}))