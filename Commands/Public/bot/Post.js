const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const path = require('path');
const imagesFile = path.join(__dirname, '../../Developer/Owner/images.json');

function readImages() {
  try {
    return JSON.parse(fs.readFileSync(imagesFile));
  } catch {
    return { lastImageNumber: 0, images: {} };
  }
}

function saveImages(imagesData) {
  fs.writeFileSync(imagesFile, JSON.stringify(imagesData));
}

module.exports = {
  data: new SlashCommandBuilder()
  .setName("post")
  .setDescription("GPT AI Gen - Image Manipulation")
  .addSubcommand((options) => options
  .setName("image")
  .setDescription("Grabs image from database and sends it.")
  .addStringOption(option => option
      .setName("group_id")
      .setDescription("Type")
  )
  .addStringOption(option => option
          .setName("image_id")
          .setDescription("The images ID")
    )
  ),

  async execute(interaction) {
    const groupId = interaction.options.getString('group_id');
    const imageId = interaction.options.getString('image_id');
    const imagesData = readImages();
    
    let filteredImages = [];
    let searchId = imageId;

    if (groupId) {
      filteredImages = Object.entries(imagesData.images)
        .filter(([id]) => id.startsWith(`${groupId}:`))
        .map(([id, link]) => ({ id, link }));

      if (filteredImages.length === 0) {
        await interaction.reply({ content: `No images found for group ID ${groupId}`, ephemeral: true });
        return;
      }

      searchId = filteredImages[Math.floor(Math.random() * filteredImages.length)].id;
    } else if (!imageId) {
      filteredImages = Object.entries(imagesData.images)
        .map(([id, link]) => ({ id, link }));

      if (filteredImages.length === 0) {
        await interaction.reply({ content: `No images found. Upload some images with /upload!`, ephemeral: true });
        return;
      }

      searchId = filteredImages[Math.floor(Math.random() * filteredImages.length)].id;
    }

    if (!imagesData.images.hasOwnProperty(searchId)) {
      await interaction.reply({ content: `Image with ID ${searchId} not found`, ephemeral: false });
      return;
    }

    const imgurLink = imagesData.images[searchId];
    const embed = new EmbedBuilder()
      .setTitle(`${groupId || `Rand`} Posting`)
      .setImage(imgurLink)
      .setColor(0x00FF00)
      .setFooter({text: groupId ? ` ${groupId} -  ${searchId}` : ` ${searchId}`});
    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
}