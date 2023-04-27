// rank.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const MemberLog = require('../../../Schemas/MemberLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your level, XP, and server rank'),

  async execute(interaction) {
    try {
      const serverSpecificMemberLog = MemberLog(interaction.guild.name);
      const user = interaction.user;
  
      let userData = await serverSpecificMemberLog.findOne({ GuildName: interaction.guild.name, UserID: user.id });
  
      if (!userData) {
        return interaction.reply({ content: "You don't have any XP yet. Start chatting to gain XP!", ephemeral: false });
      }
  
      const totalUsers = await serverSpecificMemberLog.countDocuments({ Guild: interaction.guild.name });
      const usersRankedByXP = await serverSpecificMemberLog.find({ Guild: interaction.guild.name }).sort({ totalxp: -1 }).exec();
      const serverRank = usersRankedByXP.findIndex(user => user.userID === userData.userID) + 1;
  
      const rankEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`${user.username}'s Rank`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          {name: 'Server Rank ', value: `${userData.xp}/${100 * Math.pow(userData.level, 1.5)}`,inline: false},
          {name: 'Level ', value: `${userData.level}`,inline: true},
          {name: 'XP ', value: `${userData.xp}`,inline: true}
        )
  
      interaction.reply({ embeds: [rankEmbed], ephemeral: false });
    } catch {
      interaction.reply(`An error occurred, Please contact the developer if this continues`)
    }
  },
};
