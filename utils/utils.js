const Category = require('../models/category')

async function saveCategories(category) {
    try {
        await new Category(category).save()
    } catch (e) {
        throw new Error(`Save Category error = ${e}`)
    }

}

module.exports.saveCategories = async function (categoryList) {
    categoryList.forEach(cat => saveCategories(cat))
}

module.exports.getNewestCategories = function (categories, cashed) {
    const updated = []
    categories.forEach(cat => {
        const cashedCategory = cashed.find(c => c.name === cat.name)
        if (cashedCategory) {
            const updatedSubCat = getNewestSubCategories(cat, cashedCategory)
            if (updatedSubCat) {
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
            const isUpdated = subCat.deals < cashedSubCat.deals
            if (isUpdated) {
                updatedSubCategory.push(subCat)
            }
        } else {
            updatedSubCategory.push(subCat)
        }
    })
    return updatedSubCategory
}