const mongoose = require('mongoose')
const parser = require('./parser')
const utils = require('./utils/utils')
const keys = require('./config/keys')
const cron = require('node-cron')

let cashedCategories;

async function start() {
    try {
        await initialization()
        cron.schedule(` */${keys.checkMinutes} * * * *`, () => {
            const random = Math.floor(Math.random() * Math.floor(keys.checkMinutes - 1))
            const delay = random * 60000
            console.log(`delay = ${random} date ${new Date()}`);
            setTimeout(()=> parserLogic(), delay)
        }, {scheduled: true});
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }

}

async function parserLogic() {
    console.log(`start parserLogic at ${new Date()}`);

    const categories = await parser(keys.fullURL());
    const newestCategories = utils.getNewestCategories(categories, cashedCategories)

    if (newestCategories.length) {
        console.log('there is exist newest Categories')
        cashedCategories = newestCategories
        await utils.saveCategories(newestCategories)
        utils.notifyAboutNewDeal(newestCategories)
    } else {
        console.log('NO newest Categories ')
    }
}

async function initialization() {
    await mongoose.connect(keys.mongodb,
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    cashedCategories = await utils.loadCategories()
    await parserLogic()
}

start()