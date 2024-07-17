const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'poll',
    description: '📊 Create a poll.',
    category: 'Moderation',
    usage: {
        format: "y!poll [question]",
        examples: [
            { command: "y!poll Do you like this bot?", functionality: "Create a poll with the question 'Do you like this bot?'" }
        ]
    },
    async execute(message, args) {
        const pollQuestion = args.join(' ');
        if (!pollQuestion) {
            return message.reply("❓ Please specify a question for the poll.");
        }

        const embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle('📊 Poll')
            .setDescription(pollQuestion)
            .setFooter({ text: `Poll created by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        try {
            const pollMessage = await message.channel.send({ embeds: [embed] });
            await pollMessage.react('👍');
            await pollMessage.react('👎');
        } catch (error) {
            console.error('There was an error creating the poll:', error);
            message.reply("❌ There was an error creating the poll.");
        }
    },
};
