const mongoose = require('mongoose')
const parser = require('./parser')
const utils = require('./utils/utils')
const keys = require('./config/keys')
const cron = require('node-cron')

let cacheCategories;
let cacheDictionary;

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
    const {newestCat, allChangedCat} = utils.checkCategories(categories, cacheCategories)

    if (newestCat.length) {
        console.log('there is newest Categories')
        await utils.updateDictionary(newestCat, cacheDictionary)
        await utils.saveDictionary(cacheDictionary)
        const translatedNewest = utils.translateCategories(newestCat, cacheDictionary)
        utils.notifyAboutNewDeal(translatedNewest)
    } else {
        console.log('No newest Categories')
    }

    if (allChangedCat.length) {
        console.log('there is ChangedCat')
        utils.updateCacheCategories(cacheCategories, allChangedCat);
        await utils.saveCategories(cacheCategories)
    }

}

async function initialization() {
    await mongoose.connect(keys.mongodb,
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    cacheCategories = await utils.loadCategories()
    cacheDictionary = await  utils.loadDictionary()
    await parserLogic()
}

start()