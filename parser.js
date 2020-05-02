const axios = require('axios')
const cheerio = require('cheerio')


module.exports = async function (url) {
    try {
        return await parse(url);
    } catch (e) {
        throw e;
    }
}

async function parse(url) {
    const page = await getPage(url)
    const categories = getCategories(page)
    return categories;
}


function getCategories($) {
    const categoryList = []
    $('#subCategoriesList .subject').each((i, catEl) => {
        const category = {}
        category.name = $(catEl).find('.subjectTitle').text()
        category.path = $(catEl).find('.subjectTitle').attr('href')
        category.subCategory = getSubCategories($, catEl)
        categoryList.push(category)
    })
    return categoryList;
}

function getSubCategories($, catEl) {
    const subCategoryList = []
    $(catEl).find('.subCategory').each((i, subCatEl) => {
        const subCategory = {}
        subCategory.name = $(subCatEl).find('h3').text()
        subCategory.deals = $(subCatEl).find('.totalNumberOfDeals').text().slice(1, -1)
        subCategory.path = $(subCatEl).attr('href')
        subCategoryList.push(subCategory)
    })
    return subCategoryList
}

async function getPage(url) {

    return await axios.get(url,
        {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
                'content-type': 'text/html; charset=UTF-8',
                'content-language': 'he',
            }
        }
    ).then(resp => cheerio.load(resp.data, {decodeEntities: false}))
}