const {GatewayIntentBits, Collection, Partials, Client } = require('discord.js');
const {Guilds, GuildMembers, GuildMessages} = GatewayIntentBits
const {User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [ Guilds, GuildMessages, GuildMembers ],
  partials: [ User, Message, GuildMember, ThreadMember ]
});

const { loadEvents } = require('./Handlers/eventHandler');
const { connect } = require('mongoose')

require('dotenv').config();
client.commands = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection()
client.events = new Collection();
client.guildConfig = new Collection();

connect(process.env.MONGO_URI, {
}).then(() => console.log("The Client is connected to the database."))

loadEvents(client);

client.login(process.env.BOT_TOKEN); 