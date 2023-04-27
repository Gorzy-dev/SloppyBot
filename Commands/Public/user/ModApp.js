const { EmbedBuilder, SlashCommandBuilder, GatewayIntentBits, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const MemberLogSchema = require('../../../Schemas/MemberLog');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('mod-apply')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Apply for mod'),


  /**
   *
   * @param {Interaction} interaction
   */

  async execute(interaction, client, message) {
    const embed = new EmbedBuilder()
      .setTitle('Mod Application')
      .setDescription(`${interaction.user.username} has applied to be a mod.`)
      .setColor(0x00FF00)
      .setTimestamp();
  
    try {
      const appSchema = await MemberLogSchema.findOne({modAppChannel, serverID});
      const modAppChannel = appSchema.modAppChannel;


      const channel = client.channels.cache.get(modAppChannel);



    channel.send({ embeds: [embed] })
        .then(() => interaction.reply(`Sent mod application!`))
        .catch(error => console.error(`Error sending mod application to channel ${modAppChannel}:`, error));
    } catch (err) {
      console.error(err);
      interaction.reply('There are no mod applications going for this server.');
    }
    
  },
}
