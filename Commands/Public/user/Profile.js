const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, User } = require('discord.js');
const MemberLog = require('../../../Schemas/MemberLog'); // Import your MemberLog schema

module.exports = {
  
  data: new SlashCommandBuilder()

    .setName('profile')
    .setDescription('Spy on someone')
    .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false))
    .addStringOption(option => option.setName('description').setDescription('Set your profile description').setRequired(false)),

  async execute(interaction, client) {
    const usermention = interaction.options.getUser('user') || interaction.user;
    const serverSpecificMemberLog = MemberLog(interaction.guild.id);
    const userData = await serverSpecificMemberLog.findOne({ Guild: interaction.guild.id, UserID: usermention.id });

        // Check if the command executor wants to set their profile description
      if (interaction.options.getString('description') && usermention.id === interaction.user.id) {
          userData.description = interaction.options.getString('description');
          await userData.save();
          return interaction.reply({ content: 'Your profile description has been updated!', ephemeral: true });
      }

    const level = userData ? userData.level : 1;
    const xp = userData ? userData.xp : 0;
    const description = userData ? userData.description : 'No description set.';
    const now = Date.now();
    const lastMine = userData ? userData.lastMine : 0;
    const COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds
    const timeRemaining = Math.max((lastMine + COOLDOWN) - now, 0);
    const minutes = Math.floor(timeRemaining / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
    const mineTimer = timeRemaining > 0 ? `${minutes}m ${seconds}s` : 'Ready to mine';

    const cmp = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('User Info')
          .setCustomId('info')
          .setDisabled(true)
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setLabel('Avatar')
          .setCustomId('avatar')
          .setStyle(ButtonStyle.Secondary)
      )

    const cmp2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('User Info')
          .setCustomId('info')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setLabel('Avatar')
          .setCustomId('avatar')
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary),
      )

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({ name: usermention.tag })
      .setDescription(`${description}`)
      .setThumbnail(usermention.displayAvatarURL())
      .addFields(
        {name: 'Server Rank ', value: `${userData.xp}/${100 * Math.pow(userData.level, 1.5)}`,inline: false},
        { name: '__Level__', value: `${level}`, inline: true },
        { name: '__XP__', value: `${xp}`, inline: true },
      )
      .addFields(
        { name: '__Wallet__', value: `${userData.wallet}`, inline: false },
        { name: '__Mine Timer:__', value: `${mineTimer}`, inline: true },
      )

    const embed2 = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({ name: usermention.tag, iconURL: usermention.displayAvatarURL({ dynamic: true, size: 512 }) })
      .setURL(usermention.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))
      .setImage(usermention.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))

    const message = await interaction.reply({ embeds: [embed], components: [cmp] });
    const collector = await message.createMessageComponentCollector();

    collector.on('collect', async c => {
      if (c.customId === 'info') {
        if (c.user.id !== interaction.user.id) {
          return await c.reply({ content: `Only ${interaction.user.tag} can interact with the buttons!`, ephemeral: true })
        }
        await c.update({ embeds: [embed], components: [cmp] })
      }
  
            if (c.customId === 'avatar') {
                if (c.user.id !== interaction.user.id) {
                    return await c.reply({ content: `Only ${interaction.user.tag} can interact with the buttons!`, ephemeral: true})
                }
                await c.update({ embeds: [embed2], components: [cmp2]})
            }
        })
    }
}
