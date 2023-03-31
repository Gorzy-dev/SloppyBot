const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guildinfo')
    .setDescription('Get information about the guild.'),
  async execute(interaction) {
    const guild = interaction.guild;
    const roles = guild.roles.cache.map(role => role.toString()).join(', ');

    const embed = new EmbedBuilder()
      .setColor('ffffff')
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
      .addField('Guild created at', guild.createdAt.toISOString().slice(0, 10), true)
      .addField('Last member joined at', guild.joinedAt.toISOString().slice(0, 10), true);

    const rolesEmbed = new EmbedBuilder()
      .setColor('ffffff')
      .setTitle(`Roles in ${guild.name}`)
      .setDescription(roles);

    const cmp = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Roles')
        .setCustomId('roles')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [cmp] });

    const message = await interaction.fetchReply();
    const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

    collector.on('collect', async (c) => {
      if (c.customId === 'roles') {
        if (c.user.id !== interaction.user.id) {
          return await c.reply({ content: `Only ${interaction.user.tag} can interact with the buttons!`, ephemeral: true });
        }

        const currentEmbed = c.message.embeds[0];

        if (currentEmbed.title === guild.name) {
          await c.update({ embeds: [rolesEmbed], components: [cmp] });
        } else {
          await c.update({ embeds: [embed], components: [cmp] });
        }
      }
    });

    collector.on('end', () => {
      if (!interaction.replied) interaction.deleteReply();
    });
  },
};
