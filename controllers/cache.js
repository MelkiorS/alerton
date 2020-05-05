const Category = require('../models/category')
const Dictionary = require('../models/dictionary')

let cacheCategories;
let cacheDictionary;

module.exports.init = async function () {
    try {
        cacheCategories = await Category.find()
        cacheDictionary = await Dictionary.findOne({lang: 'he'})
    } catch (e) {
        console.log(`Cash init ERROR = ${e}`)
        throw e;
    }
}

//TODO return a copy of the object
module.exports.cacheCategories = function () {
    const catCopy = []
    if (cacheCategories) {
         cacheCategories.forEach(cat=>{
             const subCatCopy = cat.subCategory.map((sc)=> {
               return  {...sc}
             })
            console.log(subCatCopy)
         })
    } else {
        throw new Error(' need to init cache before')
    }
}
