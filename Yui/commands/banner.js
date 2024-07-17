const indicators = {
    text: ":regional_indicator_%s:",
    number: ":%s:",
    special: {
        '!': ":exclamation:",
        '?': ":question:",
        '<3': ":heart:",
        ':)': ":smile:",
        ':(': ":frowning:",
        ';)': ":wink:"
    }
};

const numbers = new Map([
    [0, "zero"], [1, "one"], [2, "two"], [3, "three"], [4, "four"],
    [5, "five"], [6, "six"], [7, "seven"], [8, "eight"], [9, "nine"]
]);

const makeBanner = (input) => {
    return input.toLowerCase().split('').map(c => {
        if (c === " ") return "   ";
        if (c.match(/[a-z]/i)) return `${indicators.text.replace("%s", c)} `;
        if (c.match(/[0-9]/)) return `${indicators.number.replace("%s", numbers.get(parseInt(c)))} `;
        if (indicators.special[c]) return `${indicators.special[c]} `;
        return `${c} `;
    }).join('').trim();
};

module.exports = {
    name: 'banner',
    description: '✨ Transform your text into a vibrant emoji banner! ✨',
    category: 'Fun',
    usage: {
        format: "y!banner <your magical message>",
        examples: [
            { command: "y!banner Hello World!", result: "Transforms into: :regional_indicator_h: :regional_indicator_e: :regional_indicator_l: :regional_indicator_l: :regional_indicator_o:    :regional_indicator_w: :regional_indicator_o: :regional_indicator_r: :regional_indicator_l: :regional_indicator_d: :exclamation:" },
            { command: "y!banner I <3 Yui", result: "Transforms into: :regional_indicator_i:    :heart:    :regional_indicator_y: :regional_indicator_u: :regional_indicator_i:" }
        ]
    },
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply("✨ Oops! Don't forget to give me a message to transform into a magical banner! Try again with `y!banner Your Message Here` ✨");
        }

        const input = args.join(' ');
        const bannerText = makeBanner(input);

        message.channel.send({ 
            content: `${bannerText}`, 
            allowedMentions: { parse: [] } 
        });
    },
};