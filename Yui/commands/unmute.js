const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'unmute',
    description: '🔊 Unmute a specified member.',
    category: 'Moderation',
    usage: {
        format: "y!unmute [@user]",
        examples: [
            { command: "y!unmute @user", functionality: "Unmute the mentioned user" }
        ]
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply("❌ You do not have permission to use this command.");
        }

        const user = message.mentions.members.first();
        if (!user) {
            return message.reply("❓ Please mention a user to unmute.");
        }

        try {
            await user.voice.setMute(false);
            const embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setDescription(`✅ ${user} has been unmuted`)
                .setFooter({ text: `Unmuted by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('There was an error unmuting the member:', error);
            message.reply("❌ There was an error unmuting the member.");
        }
    },
};
