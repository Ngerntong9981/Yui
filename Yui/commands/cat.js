const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const CATGIRL_EMOJIS = ["😻", "🐾", "🎀", "🌸", "✨"];
const CATGIRL_PHRASES = [
    "Nya~ Here's a cute catgirl for you!",
    "Meow! Enjoy this adorable catgirl!",
    "Purr-fection! Check out this kawaii catgirl!",
    "Nyan nyan~ A wild catgirl appeared!",
    "Mew mew! Here's a charming catgirl just for you!"
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
    name: 'catgirl',
    description: '🐱 Posts a random image of an adorable catgirl!',
    aliases: ['catgirls', 'neko', 'nekos', 'nya', 'nyaa'],
    category: 'Image',
    cooldown: 5,
    usage: {
        format: "y!catgirl",
        examples: [
            { command: "y!catgirl", functionality: "Shows a random catgirl image" },
            { command: "y!neko", functionality: "Alternative command for catgirl images" }
        ]
    },
    async execute(message) {
        const randomEmoji = getRandomElement(CATGIRL_EMOJIS);
        const randomPhrase = getRandomElement(CATGIRL_PHRASES);

        const embed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor || '#FF69B4')
            .setDescription(`${randomEmoji} **| ${randomPhrase}**`)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        try {
            const imagePath = getRandomImageFromFolder(path.join(__dirname, 'cat'));
            embed.setImage('attachment://catgirl.gif');
            await message.channel.send({ embeds: [embed], files: [{ attachment: imagePath, name: 'catgirl.gif' }] });
            await message.react('🐱');
        } catch (error) {
            console.error("Error sending catgirl image:", error);
            await message.reply("Sorry, images cannot be retrieved at this time. Please try again later!");
        }
    },
};
