// Commands/wallet.js
const {EmbedBuilder} = require('@discordjs/builders');
const Bank = require('../../../Schemas/BankSchema');
const MemberLog = require('../../../Schemas/MemberLog');


module.exports = {
  subCommand: "currency.bank",

  async execute(interaction, client) {
    const user = interaction.user;
    let bankData = await Bank.findOne({ botID: client.user.id });

      const serverSpecificMemberLog = MemberLog(interaction.guild.name);
      let userData = await serverSpecificMemberLog.findOne({ GuildName: interaction.guild.name, UserID: user.id });


    if (!bankData) {
      bankData = new Bank({
        botID: client.user.id,
        totalCoins: 0,
      });
    }
    
      if (!userData) {
        userData = new MemberLog({
          Guild: interaction.guild.id,
          UserID: user.id,
          GuildName: interaction.guild.name,
          UserName: user.username,
        });
      } else {
        userData.GuildName = interaction.guild.name;
        userData.UserName = user.username;
      }


      const totalSlopCoins = bankData.totalCoins;

  const WalletEmbed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle(`Slop bank`)
      .setDescription(`%5 Interest`)
      .addFields(
        {name: `SlopBank `, value: `Coins: `, inline: true},
        { name: 'Circulating', value: `${totalSlopCoins} `, inline: true },
        { name: '\u200B', value: '\u200B' },
      )
      .addFields(
        {name: `User Bank `, value: `Stored`, inline: true},
        { name: 'Coins: ', value: `${userData.slopCoin} `, inline: true },
      )
      .setThumbnail('https://imgur.com/rML3daL.png')
      .setTimestamp()
      .setFooter({ text: 'Sloppy', iconURL: 'https://imgur.com/rML3daL.png' });

    await interaction.reply({ embeds: [WalletEmbed] });
  },
};
