const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const commandCategoryList = require('./category_list');
const dotenv = require('dotenv');
dotenv.config();
const { QuickDB } = require('quick.db');
const serverStatus = require('./commands/serverstatus');

const database = new QuickDB({
    filePath: process.env.DATABASE_PATH || "./database.sqlite"
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const commands = new Map();

const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`${__dirname}/commands/${file}`);
    if (!command.name || !command.execute) {
        console.log(`Ignoring loading invalid command from ${file} file!`)
        continue
    }

    console.log(`Loading ${command.name} command from ${file}...`)
    if (command.category) {
        if (!commandCategoryList.hasCategory(command.category)) {
            console.log(`[WARN] Command ${command.name} has a category (${command.category}) that doesn't exist in the categories list.`)
        }
    }
    else {
        console.log(`[WARN] Command ${command.name} has no category set!`)
    }
    commands.set(command.name, command);
}

client.prefix = "y!";
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    serverStatus.init(client);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().startsWith(client.prefix.toLowerCase())) {
        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = commands.get(commandName);
        if (!command) return;
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error trying to execute the \`${command.name}\` command!`);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);

module.exports.getDatabase = () => {return database}
module.exports.getCommands = () => {return [...commands.values()]}