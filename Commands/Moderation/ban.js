const { 
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js')

const Database = require('../../Schemas/Infractions')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("ban Someone")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(options => options
        .setName("target")
        .setDescription("Select the target memeber.")
        .setRequired(true)
    )
    .addStringOption(options => options
        .setName("reason")
        .setDescription("Provide a readon for this Ban.")
        .setMaxLength(512)
    ),

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

        target.ban(reason).catch((err) => {
            interaction.reply({embeds: [errorsEmbed.setDescription("Could not ban user due to an uncommon error.")]
        })

            return console.log("Error occured in ban.js", err)
        })

        const newInfractionsObject = {
            IssuerID: member.id,
            IssuerTag: member.user.tag,
            Reason: reason,
            Date: Date.now()
        }

        let userData = await Database.findOne({Guild: guild.id, User: target.id});
        if(!userData) 
        userData = await Database.create({Guild: guild.id, User: target.id, Infractions: [newInfractionsObject]})
        else userData.Infractions.push(newInfractionsObject) && await userData.save();

        const successEmbed = new EmbedBuilder()
        .setAuthor({name: "ban issues", iconURL: guild.iconURL()})
        .setColor("Green")
        .setDescription([
            `${target} was issued a ban by ${member}`,
            `Reason: ${reason}`
        ].join("\n"));

        return interaction.reply({embeds: [successEmbed]})
    }
}