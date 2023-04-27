const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    developer: false,
    data: new SlashCommandBuilder()
        .setName("moderation")
        .setDMPermission(false)
        .setDescription("Moderate the server")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand((options) => options
            .setName("ban")
            .setDescription("Ban a user")
            .addUserOption(option => option
                .setName("user")
                .setDescription("The user to ban")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("reason")
                .setDescription("The reason for the ban")
                .setMaxLength(512)
                .setRequired(false)
            )
        )

            .addSubcommand((options) => options
            .setName("kick")
            .setDescription("Kick a user")
            .addUserOption(option => option
                .setName("user")
                .setDescription("The user to kick")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("reason")
                .setDescription("The reason for the kick")
                .setMaxLength(512)
                .setRequired(false)
        )
    )
}