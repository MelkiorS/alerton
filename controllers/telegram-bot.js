const TelegramBot = require('node-telegram-bot-api');
const keys = require('../config/keys')

const bot = new TelegramBot(keys.botToken, {polling: true});

bot.on('message', (msg) => {

    const Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.chat.id,"Hello dear user")
            .then(resp=>console.log(resp))
            .catch(resp=>console.log(`catch ${resp}`));
    }

});

module.exports = bot