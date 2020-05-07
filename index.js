const mongoose = require('mongoose')
const parser = require('./parser')
const utils = require('./utils/utils')
const keys = require('./config/keys')
const cron = require('node-cron')
const bot  = require('./controllers/telegram-bot')

const express = require('express')
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000

let cacheCategories;
let cacheDictionary;

async function start() {
    try {
        await initialization()
        cron.schedule(` */${keys.wakeUpPeriod} * * * *`,()=>{
            utils.wakeUp()
        },{scheduled: true})

        cron.schedule(` */${keys.checkMinutes} 4-20 * * *`, () => {
            const random = Math.floor(Math.random() * Math.floor(keys.checkMinutes - 1))
            const delay = random * 60000
            setTimeout(()=> parserLogic(), delay)
        }, {scheduled: true});
    } catch (e) {
        console.log('Server Error =>', e.message)
        process.exit(1)
    }

}

async function parserLogic() {
    console.log(`start parserLogic`);
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
        console.log(`there is ChangedCat ${JSON.stringify(allChangedCat)}`)
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


app.listen(PORT, () => {
        console.log(`App has been started on port ${PORT} in ${process.env.NODE_ENV} mode`)
    start().then(resp=>console.log(`start resp = ${resp}`))
});