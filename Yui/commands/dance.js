const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const DANCE_MESSAGES = [
    "Let's get this party started! 💃🕺",
    "Dancing queen, young and sweet! 👑",
    "Shake it off, shake it off! 🎵",
    "Everybody dance now! 🎶",
    "Do the boogie-woogie! 🕴️"
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomImageFromFolder(folder) {
    const files = fs.readdirSync(folder);
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    if (images.length === 0) throw new Error('No images found in the folder');
    return path.join(folder, getRandomElement(images));
}

module.exports = {
    name: 'dance',
    description: '💃 Show off your dance moves!',
    category: 'Reaction',
    usage: { format: "y!dance" },
    async execute(message) {
        const randomMessage = getRandomElement(DANCE_MESSAGES);

        const embed = new EmbedBuilder()
            .setColor('#FF1493')
            .setDescription(`**${message.author.username}** starts dancing!\n\n${randomMessage}`)
            .setImage('attachment://dance.gif')
            .setFooter({ text: "Dance like nobody's watching! 🎉" })
            .setTimestamp();

        try {
            const imagePath = getRandomImageFromFolder(path.join(__dirname, 'dance'));
            await message.channel.send({ embeds: [embed], files: [{ attachment: imagePath, name: 'dance.gif' }] });
        } catch (error) {
            console.error("Error sending dance image:", error);
            await message.reply("Sorry, images cannot be retrieved at this time. Please try again later!");
        }
    },
};
