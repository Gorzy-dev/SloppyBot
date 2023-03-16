const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Will respond with the ping of the bot"),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const message = await interaction.deferReply({
        fetchReply: true
      });

      const newMessage = `API Latency: ${client.ws.ping}\n Client Ping:${message.createdTimestamp - interaction.createdTimestamp}`
      await interaction.editReply({
          content: newMessage
      })
    },
  };
  