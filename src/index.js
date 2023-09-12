require('dotenv').config();
const { Telegraf } = require('telegraf');
//const conn = require('./db').promise();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.command('start', (ctx) => {


    ctx.reply('user_id ' + ctx.message.chat.id);
});


bot.launch();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
