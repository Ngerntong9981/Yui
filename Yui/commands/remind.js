const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'remind',
    description: '⏰ Set a reminder.',
    category: 'Moderation',
    usage: {
        format: "y!remind [time in seconds] [message]",
        examples: [
            { command: "y!remind 60 Take a break", functionality: "Set a reminder to take a break in 60 seconds" }
        ]
    },
    async execute(message, args) {
        const time = parseInt(args[0]);
        const reminderMessage = args.slice(1).join(' ');

        if (isNaN(time) || time <= 0) {
            return message.reply("❌ Please specify a valid time in seconds.");
        }
        if (!reminderMessage) {
            return message.reply("❓ Please specify a reminder message.");
        }

        const embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setDescription(`⏰ Reminder set for ${time} seconds\n**Message:** ${reminderMessage}`)
            .setFooter({ text: `Reminder set by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        await message.author.send({ embeds: [embed] });

        setTimeout(() => {
            const remindEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setDescription(`❗Reminder\n\n ${reminderMessage}`)
                .setFooter({ text: `Reminder by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            message.channel.send({ embeds: [remindEmbed] });
        }, time * 1000);
    },
};
