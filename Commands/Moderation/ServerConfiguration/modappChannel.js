const { Interaction } = require("discord.js");
const MemberLogSchema = require("../../../Schemas/MemberLog");

module.exports = {
  subCommand: "setup.appchannel",

  async execute(interaction, client) {
    const serverID = interaction.guild.id;
    const database = MemberLogSchema(serverID);
    const modappSchema = await database.findOne({});

    if (!modappSchema || !modappSchema.modAppChannel) {
      return interaction.reply({
        content: "The modApp channel is not set up yet.",
        ephemeral: true,
      });
    }

    const modAppChannelId = modappSchema.modAppChannel;
    const modAppChannel = interaction.guild.channels.cache.get(modAppChannelId);

    await interaction.reply({
      content: `The channel <#${modAppChannel.id}> has been set as the modApp channel.`,
      ephemeral: true,
    });
  },
};
