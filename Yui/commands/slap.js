const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dbUtil = require("../dbutil");

const SLAP_MESSAGES = [
    "Ouch! That must have hurt! 😖",
    "Wow, what a slap! 👋💥",
    "Somebody's in trouble! 😳",
    "That's gonna leave a mark! 🤕",
    "Talk about tough love! 💔"
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
    name: 'slap',
    description: '👋 Slap somebody for whatever reason you would do that...',
    category: 'Counter',
    usage: {
        format: "y!slap <member>",
        examples: [
            { command: "y!slap @member", functionality: "Gives a slap to @member" }
        ]
    },
    async execute(message) {
        if (!message.mentions.users.size) {
            return message.reply("❌ You need to mention a user to give them a slap!");
        }

        const user = message.mentions.users.first();
        const randomMessage = getRandomElement(SLAP_MESSAGES);

        let title, footer;
        if (user.id === message.author.id) {
            title = `🤦 **${message.author.username}** slaps themselves... But why?`;
            footer = "Self-slapping is not recommended! 🚫";
        } else {
            title = `👋 **${message.author.username}** slaps **${user.username}**!`;
            const dbPath = `userData.${message.author.id}.slapsFor.${user.id}`;
            const slapCount = await dbUtil.incrementDb(dbPath, 0, 1);
            footer = slapCount === 1 ? `First slap! Let's not make this a habit! 😅` : `That's ${slapCount} slaps now! Maybe try talking it out? 🗣️`;
        }

        const embed = new EmbedBuilder()
            .setDescription(`${title}\n\n${randomMessage}`)
            .setColor('#FF4500')
            .setImage('attachment://slap.gif')
            .setFooter({ text: footer })
            .setTimestamp();

        try {
            const imagePath = getRandomImageFromFolder(path.join(__dirname, 'slap'));
            await message.channel.send({ embeds: [embed], files: [{ attachment: imagePath, name: 'slap.gif' }] });
        } catch (error) {
            console.error("Error sending slap image:", error);
            await message.reply("Sorry, images cannot be retrieved at this time. Please try again later!");
        }
    },
};