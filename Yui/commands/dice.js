const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'dice',
    description: '🎲 Roll a dice and try your luck!',
    category: 'Gambling',
    usage: {
        format: "y!dice <sides> [choice] [bet]",
        examples: [
            { command: "y!dice 6", functionality: "Rolls a 6-sided die" },
            { command: "y!dice 20 15 100", functionality: "Rolls a 20-sided die, betting 100 on 15" }
        ]
    },
    execute(message, args) {
        if (args.length < 1) {
            return message.reply("❌ Please specify the number of sides for the die!");
        }

        const sides = parseInt(args[0]);
        if (isNaN(sides) || sides < 2) {
            return message.reply("❌ Please provide a valid number of sides (2 or more)!");
        }

        const result = Math.floor(Math.random() * sides) + 1;
        let description = `🎲 You rolled a **${result}**!`;

        if (args.length >= 3) {
            const choice = parseInt(args[1]);
            const bet = parseInt(args[2]);

            if (isNaN(choice) || isNaN(bet)) {
                return message.reply("❌ Invalid choice or bet amount!");
            }

            if (choice === result) {
                description += `\n\n🎉 Congratulations! You won ${bet * sides} silver!`;
            } else {
                description += `\n\n💔 Oh no! You lost ${bet} silver.`;
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#4169E1')
            .setTitle(`🎲 Dice Roll: ${sides}-sided die`)
            .setDescription(description)
            .setFooter({ text: `Rolled by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};