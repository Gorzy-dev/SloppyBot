const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDMPermission(false)
        .setDescription("Moderate the server")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand((options) => options
            .setName("appchannel")
            .setDescription("Set mod application destination")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("select the channel")
                .setRequired(true)
            )
        )
}