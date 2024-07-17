const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'msgdel',
    description: '🗑️ Delete the specified number of messages.',
    category: 'Moderation',
    usage: {
        format: "y!msgdel [จำนวน]",
        examples: [
            { command: "y!msgdel 10", functionality: "Delete the last 10 messages" },
            { command: "y!msgdel 50", functionality: "Delete the last 50 messages." }
        ]
    },
    async execute(message, args) {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply("❌ You do not have permission to use this command.");
        }
        if (!args[0]) {
            return message.reply("❓ Please specify the number of messages you want to delete.");
        }

        const deleteCount = parseInt(args[0]);
        if (isNaN(deleteCount) || deleteCount <= 0 || deleteCount > 100) {
            return message.reply("❌ Please enter a number between 1 and 100.");
        }

        try {
            const fetched = await message.channel.messages.fetch({ limit: deleteCount + 1 });
            await message.channel.bulkDelete(fetched);
            const embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setDescription(`✅ ${deleteCount} message successfully deleted`)
                .setFooter({ text: `delete by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            const confirmationMessage = await message.channel.send({ embeds: [embed] });
            setTimeout(() => confirmationMessage.delete(), 5000);

        } catch (error) {
            console.error('There was an error deleting the message.:', error);
            message.reply("❌ There was an error deleting the message.");
        }
    },
};