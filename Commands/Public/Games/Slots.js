const { SlashCommandBuilder } = require('@discordjs/builders');
const MemberLog = require('../../../Schemas/MemberLog');

const SLOT_ITEMS = ['🍇', '🍒', '🍊', '🍋', '🍉', '🍓'];

function spinSlots() {
  return Array.from({ length: 3 }, () => SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)]);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Play a game of slots using slop coins')
    .addIntegerOption(option =>
      option
        .setName('bet')
        .setDescription('The amount of slop coins you want to bet')
        .setRequired(true),
    ),

  async execute(interaction) {
    const betAmount = interaction.options.getInteger('bet');
    const user = interaction.user;

    if (betAmount < 1) {
      await interaction.reply('You must bet at least 1 slop coin to play.');
      return;
    }

    const serverSpecificMemberLog = MemberLog(interaction.guild.name);
    let userData = await serverSpecificMemberLog.findOne({ Guild: interaction.guild.id, UserID: user.id });

    if (!userData) {
        userData = new serverSpecificMemberLog({
          Guild: interaction.guild.id,
          UserID: user.id,
          GuildName: interaction.guild.name,
          UserName: user.username,
          slopCoin: 0,
        });
        serverSpecificMemberLog.users.push(userData);
        await userData.save();
      }

    if (userData.slopCoin < betAmount) {
      await interaction.reply("You don't have enough slop coins to make this bet.");
      return;
    }

    userData.slopCoin -= betAmount;
    await userData.save();

    const slots = spinSlots();

    if (slots[0] === slots[1] && slots[1] === slots[2]) {
      const winAmount = betAmount * 2;
      userData.slopCoin += winAmount;
      await userData.save();
      await interaction.reply(`🎰 | ${slots[0]} | ${slots[1]} | ${slots[2]}\nYou won ${winAmount} slop coins!`);
    } else {
      await interaction.reply(`🎰 | ${slots[0]} | ${slots[1]} | ${slots[2]}\nYou lost ${betAmount} slop coins. Better luck next time!`);
    }
  },
};
