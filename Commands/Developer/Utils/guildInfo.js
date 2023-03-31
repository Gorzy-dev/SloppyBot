const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require("discord.js");

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("absi")
      .setDescription("Admin bot servers informations")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .setDMPermission(false),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        client.emit("guildMemberAdd", interaction.member);

        interaction.reply({content: `Bot is in ${client.guilds.cache.size} servers`, ephemeral: true});
    },
  };
  