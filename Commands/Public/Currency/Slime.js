// Import necessary dependencies and models
const { EmbedBuilder, ButtonBuilder, SlashCommandBuilder } = require('@discordjs/builders');
const {ButtonStyle, ActionRowBuilder} = require('discord.js')
const MemberLog = require('../../../Schemas/MemberLog');

// List of items with their respective rarity and min/max values
const items = [
  { name: 'CommonSlopPack', rarity: 'common', min: 1, max: 10 },
  { name: 'Slop-Coins', rarity: 'common', min: 1, max: 10 },
  { name: 'Slop-Jug', rarity: 'common', min: 1, max: 10 },
  { name: 'RareSlopPack', rarity: 'rare', min: 50, max: 150 },
  { name: 'Slop-Coins', rarity: 'rare', min: 50, max: 150 },
  { name: 'UltraRareSlopPack', rarity: 'ultra rare', min: 150, max: 500 },
  { name: 'Slop-Coin', rarity: 'ultra rare', min: 150, max: 500 },
  { name: 'Slop-Jug', rarity: 'ultra rare', min: 150, max: 500 },
];

function generateRandomItem() {
  // Filter items by rarity level
  const commonItems = items.filter((item) => item.rarity === 'common');
  const rareItems = items.filter((item) => item.rarity === 'rare');
  const ultraRareItems = items.filter((item) => item.rarity === 'ultra rare');

  // Generate a random number to pick a random item from the filtered list
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  // Pick a random item from the filtered list based on the random number
  if (randomNumber <= 70) {
    // Common item
    const randomCommonItem = commonItems[Math.floor(Math.random() * commonItems.length)];
    return { name: randomCommonItem.name, rarity: randomCommonItem.rarity };
  } else if (randomNumber <= 90) {
    // Rare item
    const randomRareItem = rareItems[Math.floor(Math.random() * rareItems.length)];
    return { name: randomRareItem.name, rarity: randomRareItem.rarity };
  } else {
    // Ultra rare item
    const randomUltraRareItem = ultraRareItems[Math.floor(Math.random() * ultraRareItems.length)];
    return { name: randomUltraRareItem.name, rarity: randomUltraRareItem.rarity };
  }
}

// Export the command module
module.exports = {
  data: new SlashCommandBuilder()
    .setName('slime')
    .setDescription('Open a specified number of slime Juggs'),

    async execute(interaction) {
      try {

    const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel(`open juggs`)
        .setCustomId(`open`)
        .setStyle(ButtonStyle.Primary),
    )

    const user = interaction.user;
    const guild = interaction.guild;

    // Check if the command was used in a server
    if (!guild) {
      await interaction.reply(`This command can only be used in a server.`);
      return;
    }

    // Get the server-specific MemberLog collection from Mongoose
    const serverSpecificMemberLog = MemberLog(interaction.guild.name);

    // If there was an error getting the MemberLog collection, reply with an error message
    if (!serverSpecificMemberLog) {
      await interaction.reply(`Sorry, there wasan error getting your Slime Juggs information. Please contact an admin.`);
      return;
    }

      // Get the user's data from the database or create a new entry if it doesn't exist
      let userData = await serverSpecificMemberLog.findOne({ Guild: interaction.guild.id, UserID: user.id });
      
      // If user data could not be retrieved, create a new user entry in the database
      if (!userData) {
        userData = new serverSpecificMemberLog({
          Guild: interaction.guild.id,
          UserID: user.id,
          GuildName: interaction.guild.name,
          UserName: user.username,
        });
        serverSpecificMemberLog.users.push(userData);
        await userData.save();
      }
      
      const slimeJuggs = userData.slimeJuggs;
      
      // Create an embed with the user's slime Juggs information
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`You have ${slimeJuggs} slime Juggs!`)
        .setDescription(`Click the button below to open them and see what you get!`);
      
      // Create a button for the user to open their slime Juggs

      
      // Send the embed and button as a reply to the user's interaction
      await interaction.reply({ embeds: [embed], components: [button] });
      
      // Create a collector to listen for the user opening their slime Juggs
      const filter = (i) => i.customId === 'open' && i.user.id === user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 60000 });
      
      // When the user opens their slime Juggs, generate the items and update the user's slime Juggs balance
      collector.on('collect', async () => {
        await interaction.editReply({ components: [button] });
      
      const itemsFound = [];
      const raritiesFound = [];
      
      for (let i = 0; i < slimeJuggs; i++) {
        const slimeJugg = generateRandomItem();
        itemsFound.push(slimeJugg.name);
        raritiesFound.push(slimeJugg.rarity);
      }
      
      // Update the user's slimeJuggs balance to 0
      userData.slimeJuggs = 0;
      await userData.save();
      
      // Send a message with the items and rarities found in the slimeJuggs
      const itemsFoundStr = itemsFound.join(', ');
      const raritiesFoundStr = raritiesFound.join(', ');
      
      const resultsEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`You opened ${slimeJuggs} slime Juggs!`)
        .setDescription(`You found: ${itemsFoundStr}`)
        .addFields({ name: 'Rarities:', value: `${raritiesFoundStr}` })
        .setThumbnail('https://imgur.com/p5VI1zG.png')
        .setTimestamp()
        .setFooter({ text: 'Sloppy-coins', iconURL: `https://imgur.com/rML3daL.png` });
      
        // Send the results as a follow-up message with the open button re-enabled
        await interaction.followUp({
          embeds: [resultsEmbed],
          components: [button],
        });
        
      });
    } catch (error) {
      // If any error occurs during execution, reply with an error message
      await interaction.reply('An error occurred while executing the command. Please try again later.');
      console.error(error);
    }
  }
}