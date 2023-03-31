const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.openai
});

const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Ask Chat-GPT to generate an image!')
        .addStringOption(option => option.setName('i-content')
        .setDescription('What do you want to generate?')
        .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
                
        const image = interaction.options.getString('i-content');
                
        await interaction.editReply({ content: 'Please wait while your image is being generated!' });
                
    try {

        const response = await openai.createImage({
        prompt: image,
        n: 1, // Amount of images to send
        size: '1024x1024', // 256x256 or 512x512 or 1024x1024

    });
                
    interaction.editReply({ content: response.data.data[0].url });

    } catch (error) {

    console.error(error.response.status);
    console.log(error.response.status === 400, `Bad request`)
                
    if (error.response && error.response.status === 402) {
        const message = error.response.data.error.message;
                
    if (message.startsWith('Unauthorized use detected')) {
        interaction.editReply({ content: 'This request violates OpenAI\'s terms of service.' });
        return;
        }
    }

    if (error.response && error.response.status === 400) {
        const message = error.response.data.error.message;
                
    if (message.startsWith('Unauthorized use detected')) {

        interaction.editReply({ content: 'This request violates OpenAI\'s terms of service.' });
        return;

        }
    }
                
            interaction.editReply({ content: 'Cannot generate image' });
        }
    }            
}