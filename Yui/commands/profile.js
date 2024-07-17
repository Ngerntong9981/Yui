const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'profile',
    description: '👤 Display user profile information',
    category: 'Profile',
    usage: {
        format: "y!profile [@user]",
        examples: [
            { command: "y!profile", functionality: "Show your own profile" },
            { command: "y!profile @user", functionality: "Show profile of mentioned user" }
        ]
    },
    async execute(message, args) {
        const target = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(target.id);
        const topRole = member.roles.highest.name !== '@everyone' ? member.roles.highest : 'No special role';
        const formatDate = (date) => new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);

        const embed = new EmbedBuilder()
            .setColor(member.displayHexColor || '#1E90FF')
            .setTitle(`${target.username}`)
            .setDescription(`${customStatus}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '📛 Username', value: `${target.username}#${target.discriminator}`, inline: true },
                { name: '🆔 ID', value: target.id, inline: true },
                { name: '🎭 Role', value: `${topRole}`, inline: true },
                { name: '📅 Account Created', value: formatDate(target.createdAt), inline: false },
                { name: '🌟 Joined Server', value: formatDate(member.joinedAt), inline: false },
                { name: '🎨 Roles', value: member.roles.cache.size > 1 
                    ? member.roles.cache.filter(r => r.name !== '@everyone').sort((a, b) => b.position - a.position).map(r => `\`${r.name}\``).join(', ')
                    : 'No roles' 
                }
            )
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};