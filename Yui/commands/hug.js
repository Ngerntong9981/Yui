const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dbUtil = require("../dbutil");

const HUG_EMOJIS = ["🤗", "🫂", "💖", "😊", "☺️"];

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
    name: 'hug',
    description: '🤗 Give a warm hug to someone who needs it!',
    category: 'Counter',
    usage: {
        format: "y!hug <member>",
        examples: [
            { command: "y!hug @member", functionality: "Gives a hug to @member" }
        ]
    },
    async execute(message) {
        if (!message.mentions.users.size) {
            return message.reply("💔 Aww, you need to mention someone to hug them!");
        }

        const user = message.mentions.users.first();
        const randomEmoji = getRandomElement(HUG_EMOJIS);

        let title, footer;
        if (user.id === message.author.id) {
            title = `${randomEmoji} **${message.author.username}** wraps themselves in a warm self-hug. Self-love is important!`;
            footer = "Remember, you're awesome and deserving of love! 💖";
        } else {
            title = `${randomEmoji} **${message.author.username}** gives a big, warm hug to **${user.username}**!`;
            const dbPath = `userData.${message.author.id}.hugsFor.${user.id}`;
            const hugCount = await dbUtil.incrementDb(dbPath, 0, 1);
            footer = hugCount === 1 ? `Their first hug from you! How sweet! 💕` : `That's ${hugCount} hugs now! Spreading the love! 🌈`;
        }

        const embed = new EmbedBuilder()
            .setDescription(title)
            .setColor('#FFA500')
            .setImage('attachment://hug.gif')
            .setFooter({ text: footer })
            .setTimestamp();

        try {
            const imagePath = getRandomImageFromFolder(path.join(__dirname, 'hug'));
            await message.channel.send({ embeds: [embed], files: [{ attachment: imagePath, name: 'hug.gif' }] });
        } catch (error) {
            console.error("Error sending hug image:", error);
            await message.reply("Sorry, images cannot be retrieved at this time. Please try again later!");
        }
    },
};