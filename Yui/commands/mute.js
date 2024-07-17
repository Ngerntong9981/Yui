const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'mute',
    description: '🔇 Mute a specified member.',
    category: 'Moderation',
    usage: {
        format: "y!mute [@user]",
        examples: [
            { command: "y!mute @user", functionality: "Mute the mentioned user" }
        ]
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply("❌ You do not have permission to use this command.");
        }

        const user = message.mentions.members.first();
        if (!user) {
            return message.reply("❓ Please mention a user to mute.");
        }

        try {
            await user.voice.setMute(true);
            const embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setDescription(`✅ ${user} has been muted`)
                .setFooter({ text: `Muted by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('There was an error muting the member:', error);
            message.reply("❌ There was an error muting the member.");
        }
    },
};
