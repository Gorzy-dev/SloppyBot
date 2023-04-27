const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const MemberLog = require('../../../Schemas/MemberLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the leaderboard of users by level.'),
    async execute(interaction, client) {
        const guildId = interaction.guild.name;
        const users = await getUsersFromDatabase(guildId);
        users.sort((a, b) => b.level - a.level);

        if (!interaction.guild) 
        {
          interaction.reply(`Only works in a guild`)
          return;
        }

        const embeds = [];
        const buttons = [];
        const maxPerPage = 10;

        for (let i = 0; i < users.length; i += maxPerPage) {
            const pageUsers = users.slice(i, i + maxPerPage);
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Leaderboard')
                //.setThumbnail()
                .setDescription('Users sorted by level from highest to lowest');

            for (let j = 0; j < 1; j++) {
                const start = j * 5;
                const end = start + 5;
                const columnUsers = pageUsers.slice(start, end);

                columnUsers.forEach((user, index) => {
                    const fieldName = `#${start + index + 1} ${user.name}`.substring(0, 25);
                    embed.addFields({ name: fieldName, value: `Level: ${user.level}` });
                });
            }

            embeds.push(embed);

            const button = new ButtonBuilder()
                .setLabel(`${i / maxPerPage + 1}`)
                .setCustomId(`leaderboard_page_${i / maxPerPage}`)
                .setStyle(ButtonStyle.Secondary);

            buttons.push(button);
        }

        const actionRow = new ActionRowBuilder().addComponents(buttons.slice(0, 5));

        await interaction.reply({ embeds: [embeds[0]], components: [actionRow] });

        const message = await interaction.fetchReply();
        //const collector = message.createMessageComponentCollector({ componentType: 'BUTTON'});
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.user.id !== interaction.user.id) {
                return await buttonInteraction.reply({ content: `Only ${interaction.user.tag} can interact with the buttons!`, ephemeral: true });
            }

            await buttonInteraction.deferUpdate();

            const pageIndex = parseInt(buttonInteraction.customId.split('_')[2]);
            await buttonInteraction.editReply({ embeds: [embeds[pageIndex]], components: [actionRow] });
        });
    },
};

async function getUsersFromDatabase(guildId) {
    const MemberLogModel = MemberLog(guildId);
    const users = await MemberLogModel.find().sort({ level: -1 }).exec();

    return users.map(user => ({
        name: user.UserName,
        level: user.level
    }));
}
