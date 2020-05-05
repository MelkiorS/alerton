const axios = require('axios')
const cheerio = require('cheerio')


module.exports = async function(url) {
    try {
        return await parse(url);
    } catch (e) {
        console.log('Parser ERROR')
        throw e;
    }
}

async function parse(url) {
    const page = await getPage(url)
    return getCategories(page)
}


function getCategories($) {
    const categoryList = []
    $('#subCategoriesList .subject').each((i, catEl) => {
        categoryList.push({
            name: $(catEl).find('.subjectTitle').text(),
            path: $(catEl).find('.subjectTitle').attr('href'),
            subCategory: getSubCategories($, catEl)
        })
    })
    return categoryList;
}

function getSubCategories($, catEl) {
    const subCategoryList = []
    $(catEl).find('.subCategory').each((i, subCatEl) => {
        subCategoryList.push({
            name: $(subCatEl).find('h3').text(),
            deals: parseInt($(subCatEl).find('.totalNumberOfDeals').text().slice(1, -1)),
            path: $(subCatEl).attr('href')
        })
    })
    return subCategoryList
}

async function getPage(url) {
try {
    const resp = await axios.get(url,
        {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
                'content-type': 'text/html; charset=UTF-8',
                'content-language': 'he',
            }
        })
    console.log(`Page load successfully from ${url}`)
    return  await cheerio.load(resp.data, {decodeEntities: false})
} catch (e) {
    console.log(`Filed load page from ${url}`)
    throw new Error(e)
}


}