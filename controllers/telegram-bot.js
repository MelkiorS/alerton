const TelegramBot = require('node-telegram-bot-api');
const keys = require('../config/keys')

const bot = new TelegramBot(keys.botToken, {polling: false});
/*
bot.on('message', (msg) => {
 try{
     if (msg.text.toString().toLowerCase().indexOf('Hi') === 0) {
         bot.sendMessage(msg.chat.id,"Hello dear user")
             .then(resp=>console.log(resp))
             .catch(resp=>console.log(`catch ${resp}`));
     }
 } catch (e) {
     console.log(`Bot error ${e}`)
 }

});*/

module.exports = bot