const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const PARTY_MESSAGES = [
    "Let's get this party started! 🎉",
    "Time to celebrate! 🥳",
    "Dance like nobody's watching! 💃🕺",
    "Turn up the music and let loose! 🎵",
    "It's party time! Woohoo! 🎊"
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
    name: 'party',
    description: '🎉 When something is worth celebrating!',
    category: 'Reaction',
    usage: { format: "y!party" },
    async execute(message) {
        const randomMessage = getRandomElement(PARTY_MESSAGES);

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setDescription(`**${message.author.username}** starts a party!\n\n${randomMessage}`)
            .setImage('attachment://party.gif')
            .setFooter({ text: "Join the fun! 🎈" })
            .setTimestamp();

        try {
            const imagePath = getRandomImageFromFolder(path.join(__dirname, 'party'));
            await message.channel.send({ embeds: [embed], files: [{ attachment: imagePath, name: 'party.gif' }] });
        } catch (error) {
            console.error("Error sending party image:", error);
            await message.reply("Sorry, images cannot be retrieved at this time. Please try again later!");
        }
    },
};