const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'warn',
    description: '⚠️ Warn a specified member.',
    category: 'Moderation',
    usage: {
        format: "y!warn [@user] [reason]",
        examples: [
            { command: "y!warn @user Spamming", functionality: "Warn the mentioned user for spamming" }
        ]
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply("❌ You do not have permission to use this command.");
        }

        const user = message.mentions.members.first();
        if (!user) {
            return message.reply("❓ Please mention a user to warn.");
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setDescription(`⚠️ ${user} has been warned\n**Reason:** ${reason}`)
                .setFooter({ text: `Warned by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('There was an error warning the member:', error);
            message.reply("❌ There was an error warning the member.");
        }
    },
};
