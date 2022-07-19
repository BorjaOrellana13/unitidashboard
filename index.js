const discord = require('discord.js');
const bot = new discord.Client();
const chalk = require('chalk');

const fetch = require('node-fetch');
const config = require('./config.json');
const client = bot;

client.on('ready', async () => {
  console.log(chalk.green(bot.user.tag));
})

require('./dashboard/server.js')(bot);
bot.login(process.env.TOKEN);