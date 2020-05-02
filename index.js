const mongoose = require('mongoose')
const parser = require('./parser')
const utils = require('./utils/utils')
const keys = require('./config/keys')

let cashedCategories;
async function start() {
    try {
        await mongoose.connect(keys.mongodb,
            { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex : true })
            .then(() =>{
                console.log('MongoDB connected')
                // TODO load cashedCategories
                cashedCategories = []
            })
            .catch(error =>{
                console.log(`MongoDB connection problem ${error}`)
                process.exit(-1)
            } )


        const categories = await parser(keys.fullURL());
        const newestCategories = utils.getNewestCategories(categories, cashedCategories)

        if(newestCategories) {
            cashedCategories = newestCategories
            await utils.saveCategories(newestCategories)
        }


    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }

}

start()