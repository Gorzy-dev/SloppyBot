const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("gpt")
        .setDescription("GPT AI Gen - Image Manipulation")
        .addSubcommand((options) => options
        .setName("chat")
        .setDescription("Conversate with ai")
        .addStringOption(option => option
            .setName("prompt")
            .setDescription("Type")
        )
    )
        .addSubcommand((options) => options
        .setName("imagine")
        .setDescription("Generate an image")
        .addStringOption(option => option
            .setName("prompt")
            .setDescription("Type")
        ),
    )
}

