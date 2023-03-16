const { loadCommands } = require("../../Handlers/commandHandler")

require('dotenv').config();

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        loadCommands(client);

        client.user.setActivity(`memes`);

        console.log(`Logged in as ${client.user.tag}!`);
    }
}
