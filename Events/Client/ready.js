const { loadCommands } = require("../../Handlers/commandHandler")

require('dotenv').config();

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        loadCommands(client);

        const statusArray = [
            'memes',
            'Chat GPT sucks',
            'updating status',
          ];
          
          let currentStatusIndex = 0;
          
          setInterval(() => {
            client.user.setActivity(statusArray[currentStatusIndex]);
            currentStatusIndex = (currentStatusIndex + 1) % statusArray.length;
          }, 1000);
          

        console.log(`Logged in as ${client.user.tag}!`);
        console.log(`The bot is in ${client.guilds.cache.size} servers`);
    }
}
