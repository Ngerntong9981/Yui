const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dbUtil = require("../dbutil");

const KISS_EMOJIS = ["💋", "😘", "😚", "😗", "😙"];

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
    name: 'kiss',
    description: '💋 Give a big kiss to the member you tag!',
    category: 'Counter',
    usage: {
        format: "y!kiss <member>",
        examples: [
            { command: "y!kiss @member", functionality: "Gives a kiss to @member" }
        ]
    },
    async execute(message) {
        if (!message.mentions.users.size) {
            return message.reply("💔 Oops! You need to mention a user to give them a kiss!");
        }

        const user = message.mentions.users.first();
        const randomEmoji = getRandomElement(KISS_EMOJIS);

        let title, footer;
        if (user.id === message.author.id) {
            title = `${randomEmoji} **${message.author.username}** blows a kiss to themselves... Self-love is important!`;
            footer = "Remember, you're awesome! 💖";
        } else {
            title = `${randomEmoji} **${message.author.username}** gives a sweet kiss to **${user.username}**!`;
            const dbPath = `userData.${message.author.id}.kissesFor.${user.id}`;
            const kissCount = await dbUtil.incrementDb(dbPath, 0, 1);
            footer = kissCount === 1 ? `Their first kiss from you! How romantic! 💘` : `That's ${kissCount} kisses now! Love is in the air! 💖`;
        }

        const embed = new EmbedBuilder()
            .setDescription(title)
            .setColor('#FF69B4')
            .setImage('attachment://kiss.gif')
            .setFooter({ text: footer })
            .setTimestamp();

        try {
            const imagePath = getRandomImageFromFolder(path.join(__dirname, 'kiss'));
            await message.channel.send({ embeds: [embed], files: [{ attachment: imagePath, name: 'kiss.gif' }] });
        } catch (error) {
            console.error("Error sending kiss image:", error);
            await message.reply("Sorry, images cannot be retrieved at this time. Please try again later!");
        }
    },
};