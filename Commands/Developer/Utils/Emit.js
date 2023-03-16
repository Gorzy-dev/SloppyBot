const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require("discord.js");

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("emit")
      .setDescription("Emit urself")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .setDMPermission(false),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        client.emit("guildMemberAdd", interaction.member);

        interaction.reply({content: "Emitted GuildMemberAdd", ephemeral: true});
    },
  };
  