const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { OpenAIApi, Configuration } = require("openai")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Get information about the bot.'),
  async execute(interaction, client) {
    try {


    const apiLatency = `${client.ws.ping} ms`;
    await interaction.deferReply();

    setTimeout(async () => {
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Bot Info')
        .setDescription(`Hi there! I'm here to help you out with anything you need. Just let me know and I'll do my best to help.`)
        .addFields(
          { name: 'Bot_ID', value: interaction.client.user.id, inline: true },
          { name: 'Servers', value: interaction.client.guilds.cache.size.toString(), inline: true },
          { name: 'Users', value: interaction.client.users.cache.size.toString(), inline: true },
          { name: 'Library', value: 'Discord.js', inline: true },
          { name: 'Version', value: `v${process.env.botVersion}`, inline: true },
          { name: 'Creator', value: `<@268914030528299008>`, inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: `API Latency`, value: apiLatency, inline: true },
          { name: `Client Latency`, value: `${Date.now() - interaction.createdTimestamp} ms`, inline: true }
        )
        .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
        .setImage(`https://i.imgur.com/XDIC8RW.gif`)
        .setTimestamp()
        .setFooter({ text: 'Programmed by a retard', iconURL: `${interaction.client.user.displayAvatarURL({ dynamic: true })}` });


        await interaction.editReply({ embeds: [embed] });
    }, 1000);

  } catch {
    interaction.reply(`There was an unexpected error, Please try again.`)
  }
  }
};