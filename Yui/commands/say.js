const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'say',
    description: '🗨️ Yui will say what you tell her to say. (Add -hide to remove your message)',
    category: 'Fun',
    usage: {
        format: "y!say <text> [-hide]",
        examples: [
            { command: "y!say Hello", functionality: "Yui will say 'Hello'" },
            { command: "y!say Hello -hide", functionality: "Yui will say 'Hello' and delete your message" }
        ]
    },
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply("❓ Oops! You need to provide a message for me to say.");
        }

        let text = args.join(' ');
        const shouldHide = text.endsWith(" -hide");

        if (shouldHide) {
            text = text.slice(0, -6).trim();
            await message.delete().catch(console.error);
        }

        const embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setDescription(text)
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed], allowedMentions: { parse: [] } });
    },
};