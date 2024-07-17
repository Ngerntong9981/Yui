const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'serverinfo',
    description: '📊 Display server information.',
    category: 'Moderation',
    usage: {
        format: "y!serverinfo",
        examples: [
            { command: "y!serverinfo", functionality: "Display server information" }
        ]
    },
    async execute(message) {
        const { guild } = message;

        const embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle('📊 Server Information')
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Created At', value: guild.createdAt.toDateString(), inline: true },
            )
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        await message.channel.send({ embeds: [embed] });
    },
};
