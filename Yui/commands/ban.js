const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'ban',
    description: '⛔ Ban a specified member.',
    category: 'Moderation',
    usage: {
        format: "y!ban [@user] [reason]",
        examples: [
            { command: "y!ban @user Breaking rules", functionality: "Ban the mentioned user for breaking rules" }
        ]
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ You do not have permission to use this command.");
        }

        const user = message.mentions.members.first();
        if (!user) {
            return message.reply("❓ Please mention a user to ban.");
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await user.ban({ reason });
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`✅ ${user} has been banned\n**Reason:** ${reason}`)
                .setFooter({ text: `Banned by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('There was an error banning the member:', error);
            message.reply("❌ There was an error banning the member.");
        }
    },
};
