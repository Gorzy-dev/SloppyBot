const { 
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    Client
} = require('discord.js')

const Database = require('../../../Schemas/MemberLog')
const ms = require('ms')

module.exports = {
    subCommand: "moderation.kick",

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const { options, guild, member } = interaction;

        const target = options.getMember("target");
        const reason = options.getString("reason") || "None specified.";

        const errorsArray = [];

        const errorsEmbed = new EmbedBuilder()
        .setAuthor({name: "Could not time out this memeber due to"})
        .setColor("Red");

        if(!target) return interaction.reply({
            embeds: [errorsEmbed.setDescription("Member left before he could be punished, what a pussy")],
            ephemeral: true
        })


        if(!target.manageable || !target.manageable)
        errorsArray.push("Selected target isn't moderatable by this bot.");

        if(member.roles.highest.position < target.roles.highest.position)
        errorsArray.push("Selected member has a higher role position than you.");

        if(errorsArray.length){
            return interaction.reply({
                embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true
            })
        }

        target.kick(reason).catch((err) => {
            interaction.reply({embeds: [errorsEmbed.setDescription("Could not Kick user due to an uncommon error.")]
        })

            return console.log("Error occured in Kick.js", err)
        })

        const successEmbed = new EmbedBuilder()
        .setAuthor({name: "Kick issues", iconURL: guild.iconURL()})
        .setColor("Green")
        .setDescription([
            `${target} was issued a kick by ${member}`,
            `Reason: ${reason}`
        ].join("\n"));

        return interaction.reply({embeds: [successEmbed]})
    }
}