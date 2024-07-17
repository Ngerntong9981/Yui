const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'qr',
    description: '📱 Generate a QR code for a specified URL.',
    category: 'Utility',
    usage: {
        format: "y!qr [URL]",
        examples: [
            { command: "y!qr https://example.com", functionality: "Generate a QR code for the specified URL" }
        ]
    },
    async execute(message, args) {
        const url = args.join(' ');
        if (!url) {
            return message.reply("❓ Please provide a URL to generate a QR code.");
        }

        try {
            const canvas = createCanvas(200, 200);
            await QRCode.toCanvas(canvas, url, { errorCorrectionLevel: 'H' });
            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'qrcode.png' });

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('QR Code Generated')
                .setImage('attachment://qrcode.png')
                .setFooter({ text: `Generated by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('There was an error generating the QR code:', error);
            message.reply("❌ There was an error generating the QR code.");
        }
    },
};
