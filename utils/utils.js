const Category = require('../models/category')

//TODO refactor to atomic operations
async function saveCategory(category) {
    const query = {name:category.name}
    const update = { subCategory: category.subCategory }
    const options = { upsert: true, new: true };
    try {
    await Category.findOneAndUpdate(query, update, options,
        function (err, doc) {
        if(err) throw err
        if(!doc){
            doc = new Category(category)
            doc.save()
        }})
    } catch (e) {
        throw new Error(`Load Category error = ${e}`)
    }
}

module.exports.loadCategories = async function () {
    try {
        return await Category.find()
    } catch (e) {
            throw new Error(`Load Category error = ${e}`)
    }
}

module.exports.saveCategories = async function (categoryList) {
    categoryList.forEach(cat => saveCategory(cat))
}

module.exports.getNewestCategories = function (categories, cashed) {
    const updated = []
    categories.forEach(cat => {
        const cashedCategory = cashed.find(c => c.name === cat.name)
        if (cashedCategory) {
            const updatedSubCat = getNewestSubCategories(cat, cashedCategory)
            if (updatedSubCat.length) {
                const updatedCat = {
                    name: cat.name,
                    path: cat.path,
                    subCategory: updatedSubCat
                }
                updated.push(updatedCat)
            }
        } else {
            updated.push(cat)
        }
    })
    return updated
}

function getNewestSubCategories(category, cashedCategory) {
    const updatedSubCategory = []
    category.subCategory.forEach(subCat => {
        const cashedSubCat = cashedCategory.subCategory.find(sc => sc.name === subCat.name)
        if (cashedSubCat) {
            const isUpdated = subCat.deals > cashedSubCat.deals
            if (isUpdated) {
                subCat.count = subCat.deals - cashedSubCat.deals
                updatedSubCategory.push(subCat)
            }
        } else {
            updatedSubCategory.push(subCat)
        }
    })
    return updatedSubCategory
}