const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("currency")
        .setDescription("Everything currency")

        .addSubcommand((options) => options
            .setName("wallet")
            .setDescription("How much money u got?"))

        .addSubcommand((options) => options
            .setName("bank")
            .setDescription("How much money is going around"))

}
