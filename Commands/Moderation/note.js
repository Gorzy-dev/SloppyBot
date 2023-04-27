const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('note')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDescription('Send a note')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('The title of the embed'))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('The description of the embed'))
    .addStringOption(option =>
      option.setName('image')
        .setDescription('The image URL of the embed')),
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const imageUrl = interaction.options.getString('image');

    const embed = new EmbedBuilder();
        embed.setColor(0x00FF00)

    if (title) {
      embed.setTitle(title);
    }

    if (description) {
      embed.setDescription(description);
    }

    if (imageUrl) {
      embed.setImage(imageUrl);
    }


    await interaction.reply({ embeds: [embed] });
  },
};
