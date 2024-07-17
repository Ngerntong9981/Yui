const { EmbedBuilder } = require("discord.js");
const dbutil = require("../dbutil");
const ratelimiter = require('../ratelimiter');

let rateLimits = new ratelimiter.RateLimiterMap(10_000);

const COOKIE_EMOJIS = ["🍪", "🥠", "🍘", "🥮"];
const COOKIE_MESSAGES = [
    "Yum! A delicious cookie just for you!",
    "Here's a sweet treat to brighten your day!",
    "Cookies make everything better!",
    "Enjoy this little piece of happiness!",
    "A cookie a day keeps the sadness away!"
];

module.exports = {
    name: 'cookie',
    description: '🍪 Bake a lovely cookie for someone special!',
    category: 'Counter',
    usage: {
        format: "y!cookie <member>",
        examples: [
            { command: "y!cookie @member", functionality: "Gives a cookie to @member" }
        ]
    },
    async execute(message) {
        if (!message.mentions.users.size) {
            return message.reply("❓ Oops! You need to mention someone to give them a cookie!");
        }

        const user = message.mentions.users.first();
        if (user.id === message.author.id) {
            return message.reply("😅 Aww, giving yourself a cookie? How about sharing with others?");
        }

        const rateLimit = rateLimits.get(message.author.id);
        if (!rateLimit.canDo()) {
            return message.reply(`⏳ Hold on! You can give another cookie in ${rateLimit.getTimeLeftSec()} seconds.`);
        }

        const dbR = `userData.${message.author.id}.givenCookiesTo.${user.id}`;
        const cookieCount = await dbutil.incrementDb(dbR, 0, 1);

        const randomEmoji = COOKIE_EMOJIS[Math.floor(Math.random() * COOKIE_EMOJIS.length)];
        const randomMessage = COOKIE_MESSAGES[Math.floor(Math.random() * COOKIE_MESSAGES.length)];

        const embed = new EmbedBuilder()
            .setColor('#D2691E')
            .setTitle(`${randomEmoji} Cookie Time!`)
            .setDescription(`**${message.author.username}** gives a cookie to **${user.username}**!\n\n${randomMessage}`)
            .addFields({ name: "Cookie Count", value: `That's ${cookieCount} ${cookieCount === 1 ? 'cookie' : 'cookies'} now!`, inline: true })
            .setFooter({ text: "Spreading sweetness, one cookie at a time!" })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};