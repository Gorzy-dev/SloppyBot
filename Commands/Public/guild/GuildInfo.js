const { EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guildinfo')
    .setDescription('Get information about the guild.'),
  async execute(interaction) {
    const guild = interaction.guild;
    await guild.channels.fetch();
    await guild.fetchOwner();
    const ownerMember = await guild.members.fetch(guild.ownerId);
    const owner = ownerMember.user;

    const categoryChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size;
    const voiceChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size;
    const textChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size;
    const roles = guild.roles.cache.size;
    const guildCreatedDate = guild.createdAt.toDateString();
    const memberCount = interaction.guild.memberCount;
    const guildId = guild.id;

    if (!interaction.guild) 
    {
      interaction.reply(`Only works in a guild`)
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
      .addFields(
        { name: `Owner`, value: `${owner}`, inline: true },
        { name: `Category Channels`, value: `${categoryChannels}`, inline: true },
        { name: `Voice Channels`, value: `${voiceChannels}`, inline: true },
        { name: `Text Channels`, value: `${textChannels}`, inline: true },
        { name: `Roles`, value: `${roles}`, inline: true },
        { name: `Members`, value: `${memberCount}`, inline: true },
      )
      .setFooter({ text: `Guild ID: ${guildId} | Guild Create Date: ${guildCreatedDate}` });

    await interaction.reply({ embeds: [embed] });
  },
};
