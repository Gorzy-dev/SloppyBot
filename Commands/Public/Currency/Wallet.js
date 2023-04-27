// Commands/wallet.js
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const MemberLog = require('../../../Schemas/MemberLog');

module.exports = {
  subCommand: "currency.wallet",

  async execute(interaction, client) {
    const user = interaction.user;

    // Get the server-specific MemberLog collection
    const serverSpecificMemberLog = MemberLog(interaction.guild.name);

    if (!interaction.guild) 
    {
      interaction.reply(`Only works in a guild`)
      return;
    }

    // Get the user's data from the database or create a new entry if it doesn't exist
    let userData = await serverSpecificMemberLog.findOne({ GuildName: interaction.guild.name, UserID: user.id});

    // Get the user's wallet balance
    const wallet = userData.slopCoin;

    const WalletEmbed = new EmbedBuilder()
      .setColor(0x00FF00)
	    .setTitle(`${interaction.user.username}'s Wallet`)
	    .addFields(
		    { name: 'Slopcoins: ', value: `${wallet}` },
	    )
	    .setThumbnail('https://imgur.com/p5VI1zG.png')
	    .setTimestamp()
	    .setFooter({ text: 'Sloppy', iconURL: 'https://imgur.com/p5VI1zG.png' });

      await interaction.reply({ embeds: [WalletEmbed] });
  },
};
