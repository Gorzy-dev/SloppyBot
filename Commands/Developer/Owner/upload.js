const axios = require('axios');
const fs = require('fs');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const imagesFile = path.join(__dirname, 'images.json');

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
  developer: true,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('upload')
    .setDescription('Upload an image to Imgur')
    .addStringOption(option =>
      option.setName('image_url')
        .setDescription('The URL of the image you want to upload')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('group_id')
        .setDescription('The group ID for the image')
        .setRequired(false)),
  async execute(interaction) {
    const groupId = interaction.options.getString('group_id');
    const imageUrl = interaction.options.getString('image_url');

    const imagesData = readImages();

    // Generate an ID for the image
    const lastImageNumber = imagesData.lastImageNumber || 0;
    const incrementedNumber = lastImageNumber + 1;
    const imageId = groupId ? `${groupId}:${incrementedNumber}` : incrementedNumber.toString();

    try {
      const response = await axios.post('https://api.imgur.com/3/image', null, {
        headers: {
          Authorization: `Client-ID ${process.env.imgurClientId}`,
        },
        params: {
          image: imageUrl,
          name: imageId, // Set the image name as the group ID and incremented number
        },
      });

      const imgurLink = response.data.data.link;

      // Save the image link to the JSON file
      imagesData.lastImageNumber = incrementedNumber;
      imagesData.images[imageId] = imgurLink;
      saveImages(imagesData);

      await interaction.reply({ content: `Image uploaded successfully! Image ID: ${imageId}`, ephemeral: true });
    } catch (error) {
      console.error('Error uploading image to Imgur:', error);
      await interaction.reply({ content: 'An error occurred while uploading the image. Please try again.', ephemeral: true });
    }
  },
};