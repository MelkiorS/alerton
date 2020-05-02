module.exports.getNewestCategories = function (categories, cashedCategories) {
    const updated = []
    const cashed = categories // TODO just for test
    categories.forEach(cat => {
        const cashedCategory = cashed.find(c => c.name === cat.name)
        if (cashedCategory) {
             const updatedSubCat = []
            cat.subCategory.forEach(subCat => {
                const cashedSubCat = cashedCategory.subCategory.find(sc => sc.name === subCat.name)
                const isUpdated = +subCat.deals !== +cashedSubCat.deals
                if (isUpdated) {
                    updatedSubCat.push()
                }
            })

            if(updatedSubCat){
                const updatedCat = {
                    name : cat.name,
                    path : cat.path,
                    subCategory : updatedSubCat
                }

                updated.push(updatedCat)
            }

        } else {
            updated.push(cat)
        }
    })
    return updated
}