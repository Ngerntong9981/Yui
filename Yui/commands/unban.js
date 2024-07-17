const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'unban',
    description: '🔓 Unban a specified member.',
    category: 'Moderation',
    usage: {
        format: "y!unban [userID]",
        examples: [
            { command: "y!unban 123456789012345678", functionality: "Unban the user with the specified ID" }
        ]
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ You do not have permission to use this command.");
        }

        const userId = args[0];
        if (!userId) {
            return message.reply("❓ Please specify a user ID to unban.");
        }

        try {
            await message.guild.members.unban(userId);
            const embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setDescription(`✅ User with ID ${userId} has been unbanned`)
                .setFooter({ text: `Unbanned by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('There was an error unbanning the member:', error);
            message.reply("❌ There was an error unbanning the member.");
        }
    },
};
