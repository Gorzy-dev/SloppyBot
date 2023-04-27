// Commands/spend.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const MemberLog = require('../../../Schemas/MemberLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spend')
    .setDescription('Spend SlopCoin in the server')
    .addNumberOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of SlopCoin to spend')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const amount = interaction.options.getNumber('amount');
    const user = interaction.user;
    // Get the server-specific MemberLog collection
    const serverSpecificMemberLog = MemberLog(interaction.guild.id);

    if (!interaction.guild) 
    {
      interaction.reply(`Only works in a guild`)
      return;
    }


    // Get the user's data from the database
    let userData = await serverSpecificMemberLog.findOne({ Guild: interaction.guild.id, UserID: user.id });

    if (!userData || userData.slopCoin < amount) {
      return await interaction.reply('You do not have enough SlopCoin to spend.');
    }

    // Deduct the spent amount from the user's wallet
    userData.slopCoin -= amount;

    // Save the updated user data to the database
    await userData.save();

    // Your logic for spending the cryptocurrency in the server can be implemented here

    await interaction.reply(`You spent ${amount} SlopCoin.`);
  },
};
