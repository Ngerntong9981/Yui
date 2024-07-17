const { EmbedBuilder } = require("discord.js");
const main = require("../index");

module.exports = {
    name: 'help',
    description: '📚 Get help with Yui\'s commands',
    category: 'Utility',
    usage: {
        format: "y!help [command]",
        examples: [
            { command: "y!help", functionality: "Shows all command categories" },
            { command: "y!help hug", functionality: "Shows detailed help for the 'hug' command" }
        ]
    },
    async execute(message, args) {
        const embedColor = message.guild.members.me.displayColor || '#FF69B4';

        if (args.length === 1) {
            return await showCommandHelp(message, args[0], embedColor);
        }
        await showGeneralHelp(message, embedColor);
    },
};

async function showCommandHelp(message, commandName, embedColor) {
    const cmd = main.getCommands().find(command => command.name.toLowerCase() === commandName.toLowerCase());

    if (!cmd) {
        return message.reply(`❌ Oops! The command \`${commandName}\` doesn't exist.`);
    }

    const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`📘 Help: ${cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)} Command`)
        .setDescription(cmd.description)
        .addFields(
            { name: "Category", value: cmd.category, inline: true },
            { name: "Usage", value: `\`${cmd.usage.format}\``, inline: true }
        )
        .setFooter({ text: "Tip: <> means required, [] means optional" });

    if (cmd.usage.examples) {
        const examplesList = cmd.usage.examples.map(ex => `\`${ex.command}\` - ${ex.functionality}`).join('\n');
        embed.addFields({ name: "Examples", value: examplesList });
    }

    await message.channel.send({ embeds: [embed] });
}

async function showGeneralHelp(message, embedColor) {
    const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle("📚 Yui Help")
        .setDescription("\n")
        .addFields(
            { name: "📖 Command", value: "`y!commands` to see all available commands.`\n`y!help <command> to get detailed help for a specific command.`" },
          //  { name: "🔍 Specific Command Help", value: "`y!help <command>` to get detailed help for a specific command." },
            { name: "🌐 More Resources", value: "[Invite](https://discord.com/oauth2/authorize?client_id=1262402265382256721&permissions=8&integration_type=0&scope=bot)\n[Github](https://github.com/Ngerntong9981/Yui-2222.git)" }
        )
        .setFooter({ text: "Remake & Create by yu#4321" });

    await message.channel.send({ embeds: [embed] });
}