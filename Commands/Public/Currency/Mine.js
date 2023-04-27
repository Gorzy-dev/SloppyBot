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

    data: new SlashCommandBuilder()
      .setName('mine')
      .setDescription('Mine SlopCoin in the server'),


    async execute(interaction, client) {
      try {
        const user = interaction.user;
        if (!interaction.guild) {
            interaction.reply(`Only works in a guild`);
            return;
        }
        
      // Get the server-specific MemberLog collection
      const serverSpecificMemberLog = MemberLog(interaction.guild.name);
        
      // Get the user's data from the database or create a new entry if it doesn't exist
      let userData = await serverSpecificMemberLog.findOne({ GuildName: interaction.guild.name, UserID: user.id });
        
      if (!userData) {
        userData = new serverSpecificMemberLog({

          Guild: interaction.guild.id,
          UserID: user.id,
          GuildName: interaction.guild.name,
          UserName: user.username,
          slopCoin: 0,

        });

      } else {
        userData.GuildName = interaction.guild.name;
        userData.UserName = user.username;
      }
        
      // Check if the user is still in the cooldown period
      const now = Date.now();
      const lastMine = userData.lastMine || 0;
      const timeRemaining = (lastMine + COOLDOWN) - now;
        
      if (timeRemaining > 0) {
        const minutes = Math.ceil(timeRemaining / (60 * 1000));
        return await interaction.reply(`You need to wait ${minutes} more minute(s) before mining again.`);
      }
        
      // Generate a random amount of cryptocurrency to be mined
      const ranSlopCoin = getRandomCrypto();
        
      // Check if the bank has enough coins to be mined
      let bankData = await Bank.findOne({ botID: client.user.id });
        
      if (!bankData) {
        bankData = new Bank({
          botID: client.user.id,
          totalCoins: 1000000000,
        });
      }
        
      if (bankData.totalCoins < ranSlopCoin) {
        return await interaction.reply(`There are not enough coins in the bank to mine. Please try again later.`);
      }
        
      // Deduct the mined coins from the bank's totalCoins
      bankData.totalCoins -= ranSlopCoin;
      await bankData.save();
          
      // Update the user's wallet balance and lastMine timestamp
      userData.slopCoin += ranSlopCoin;
      userData.lastMine = now;
        
      // Save the updated user data to the database
      await userData.save();
        
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setImage(`https://imgur.com/rML3daL.png`)
        .setTitle('SlopCoin Mining Report')
        .setDescription(`You mined ${ranSlopCoin} Slime-Coins! \n Your new balance is ${userData.slopCoin}.`);
        
        await interaction.reply({ embeds: [embed] })
        
      } catch {
        interaction.reply(`An error occurred, Please contact the developer if this continues`)
      }
    }
  }    