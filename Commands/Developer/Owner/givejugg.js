// Commands/mine.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const MemberLog = require('../../../Schemas/MemberLog');
const Bank = require('../../../Schemas/BankSchema');

function getRandomCrypto() {
  return Math.floor(Math.random() * 3) + 1;
}

const COOLDOWN = 30 * 60 * 1000; // 30 minutes in milliseconds

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('give-jugg')
        .setDescription('give juggs'),
        async execute(interaction) {
            const user = interaction.user;
        if (!interaction.guild) {
            interaction.reply(`Only works in a guild`);
            return;
        }
          
        // Get the server-specific MemberLog collection
        const serverSpecificMemberLog = MemberLog(interaction.guild.name);
          
        // Get the user's data from the database or create a new entry if it doesn't exist
        let userData = await serverSpecificMemberLog.findOne({ Guild: interaction.guild.id, UserID: user.id });
          
        if (!userData) {
        userData = new serverSpecificMemberLog({
            Guild: interaction.guild.id,
            UserID: user.id,
            GuildName: interaction.guild.name,
            UserName: user.username,
            slimeJuggs: 0, // Add the slimeJuggs field with default value 0
        });
        } else {
              userData.GuildName = interaction.guild.name;
              userData.UserName = user.username;
        }
          
        // Add 1 to the user's slimeJuggs balance
        userData.slimeJuggs++;
          
        // Save the updated user data to the database
        await userData.save();
          
        await interaction.reply(`You have received 1 slime Jugg.`);
    }
}
