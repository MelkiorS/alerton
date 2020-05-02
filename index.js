const parser = require('./parser')
const utils = require('./utils/utils')
const keys = require('/config/keys')

 let cashed = []
async function start() {
    try {
        const categories = await parser(keys.fullURL());
        const newestCategories = utils.getNewestCategories(categories, cashed)
    } catch (e) {
        console.log(e)
    }

    process.exit(0);
}

start()