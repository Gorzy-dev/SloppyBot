const { ActivityType } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler")

require('dotenv').config();

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        loadCommands(client);

        const statusArray = [
            '/Slash',
            'Leaderboards',
            'XP',
            'Moderation',
          ];
          
          let currentStatusIndex = 0;
          
          setInterval(() => {
            client.user.setActivity(statusArray[currentStatusIndex], {type: ActivityType.Watching});
            currentStatusIndex = (currentStatusIndex + 1) % statusArray.length;
          }, 5000);          
        console.log(`Logged in as ${client.user.tag}!`);
    }
}
