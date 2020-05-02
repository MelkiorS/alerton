const mongoose = require('mongoose')
const parser = require('./parser')
const utils = require('./utils/utils')
const keys = require('./config/keys')

 let cashed = []
async function start() {
    try {
        await mongoose.connect(keys.mongoURL,
            { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex : true })
            .then(() =>{
                // TODO load cashed
            })
            .catch(error => console.log(`MongoDB connection problem ${error}`))

        const categories = await parser(keys.fullURL());
        const newestCategories = utils.getNewestCategories(categories, cashed)
    } catch (e) {
        console.log(e)
    }

    process.exit(0);
}

start()