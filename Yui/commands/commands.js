const { EmbedBuilder } = require("discord.js");
const categoryList = require("../category_list");
const main = require("../index");

module.exports = {
    name: 'commands',
    description: '📚 Displays a neat list of Yui\'s commands',
    category: 'Utility',
    usage: {
        format: "y!commands [category]",
        examples: [
            { command: "y!commands", functionality: "Shows all command categories" },
            { command: "y!commands Fun", functionality: "Lists all commands in the Fun category" }
        ]
    },
    async execute(message, args) {
        if (args.length === 1) {
            return await showCategoryCommands(message, args[0]);
        }
        await showAllCategories(message);
    },
};

async function showCategoryCommands(message, category) {
    if (!categoryList.hasCategoryIgnoreCase(category)) {
        return message.reply("❌ Oops! That category doesn't exist. Try `y!commands` to see all categories.");
    }

    const commandsFiltered = main.getCommands()
        .filter(cmd => cmd.category.toLowerCase() === category.toLowerCase());

    if (commandsFiltered.length === 0) {
        return message.reply(`⚠️ There are no commands in the \`${category}\` category!`);
    }

    const formattedCommands = commandsFiltered.map(cmd => {
        const name = cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1);
        const padding = " ".repeat(Math.max(15 - name.length, 1));
        return `• ${name}${padding}:: ${cmd.description}`;
    }).join('\n');

    const embed = new EmbedBuilder()
        .setColor(message.guild.members.me.displayColor || '#FF69B4')
        .setTitle(`📚 Commands in ${category} category`)
        .setDescription("```asciidoc\n" + formattedCommands + "\n```")
        .setFooter({ text: "Use y!help <command> for more details on a specific command!" });

    await message.channel.send({ embeds: [embed] });
}

async function showAllCategories(message) {
    const embed = new EmbedBuilder()
        .setColor(message.guild.members.me.displayColor || '#FF69B4')
        .setAuthor({ name: "Yui's Command Categories", iconURL: message.client.user.displayAvatarURL({ size: 32 }) })
        .setDescription("To view commands in each category, use:\n```y!commands <category>```")
        .setFooter({ text: "Yui is here to help! 💖" });

    const categories = categoryList.getCommandCategories().map(category => {
        const cmdAmount = main.getCommands().filter(cmd => cmd.category === category.name).length;
        return {
            name: `${category.icon} ${category.name}`,
            value: `${cmdAmount} command${cmdAmount !== 1 ? 's' : ''}`,
            inline: true
        };
    });

    embed.addFields(categories);

    await message.channel.send({ embeds: [embed] });
}