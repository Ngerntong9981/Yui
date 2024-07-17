const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'avatar',
    description: '🖼️ Display user avatar and banner',
    category: 'Profile',
    usage: {
        format: "y!avatar [@user]",
        examples: [
            { command: "y!avatar", functionality: "Show your own avatar and banner" },
            { command: "y!avatar @user", functionality: "Show avatar and banner of mentioned user" }
        ]
    },
    async execute(message, args) {
        const target = message.mentions.users.first() || message.author;

        const embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle(`${target.username}`)
            .setImage(target.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        const fetchedUser = await target.fetch();
        if (fetchedUser.banner) {
            const bannerEmbed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setImage(fetchedUser.bannerURL({ dynamic: true, size: 4096 }));
            
            await message.channel.send({ embeds: [embed, bannerEmbed] });
        } else {
            await message.channel.send({ embeds: [embed] });
        }
    },
};