const mongoose = require('mongoose')
const parser = require('./parser')
const utils = require('./utils/utils')
const keys = require('./config/keys')
const cron = require('node-cron')

let cacheCategories;
let dictionary;

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
        console.log('Server Error =>', e.message)
        process.exit(1)
    }

}

async function parserLogic() {
    console.log(`start parserLogic at ${new Date()}`);

    const categories = await parser(keys.fullURL());
    const {newest, allChanged} = utils.checkCategories(categories, cacheCategories)

    if (newest.length) {
        console.log('there is newest Categories')
        await  utils.getNewTranslations(newest, dictionary)
        await utils.saveDictionary(dictionary)
        const translatedNewest = utils.translateCategories(newest, dictionary)
        utils.notifyAboutNewDeal(translatedNewest)
    }

    if (allChanged.length) {
        cacheCategories = allChanged
        await utils.saveCategories(cacheCategories)

    }

}

async function initialization() {
    await mongoose.connect(keys.mongodb,
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    cacheCategories = await utils.loadCategories()
    dictionary = await  utils.loadDictionary()
    await parserLogic()
}

start()