const Category = require('../models/category')
const nodemailer = require('nodemailer');
const keys = require('../config/keys')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: keys.email,
        pass: keys.emailPwd
    }
});

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

module.exports.checkCategories = function (categories, cashed) {
    const newest = []
    const changedCount = []
    categories.forEach(cat => {
        const cashedCategory = cashed.find(c => c.name === cat.name)
        if (cashedCategory) {
            const checkedSubCategories = checkSubCategories(cat, cashedCategory)
            if (checkedSubCategories.newest.length) {
                const updatedCat = {
                    name: cat.name,
                    path: cat.path,
                    subCategory: checkedSubCategories.newest
                }
                newest.push(updatedCat)
            } else if (checkedSubCategories.changedCount.length){
                const updatedCat = {
                    name: cat.name,
                    path: cat.path,
                    subCategory: checkedSubCategories.changedCount
                }
                changedCount.push(updatedCat)
            }
        } else {
            cat.subCategory.forEach(subCat=>subCat.count = subCat.deals)
            newest.push(cat)
        }
    })
    return {newest, changedCount}
}

function checkSubCategories(category, cashedCategory) {
    const newest = []
    const changedCount = []
    category.subCategory.forEach(subCat => {
        const cashedSubCat = cashedCategory.subCategory.find(sc => sc.name === subCat.name)
        if (cashedSubCat) {
            if (subCat.deals > cashedSubCat.deals) {
                subCat.count = subCat.deals - cashedSubCat.deals
                newest.push(subCat)
            } else if (subCat.deals < cashedSubCat.deals){
                subCat.count = subCat.deals
                changedCount.push(subCat)
            }
        } else {
            subCat.count = subCat.deals
            newest.push(subCat)
        }
    })

    return {newest, changedCount}
}


module.exports.notifyAboutNewDeal = function(categories){

    let message = '<h1>new categories</h1>\n'
    categories.forEach(cat=> {
        message+= `    <h2>category ${cat.name}</h2>\n`
        cat.subCategory.forEach(subCat => {
            message+= `        <h3> sub category ${subCat.name}</h3>\n`
            message+= `        <a href=" ${keys.baseURL+subCat.path}">NEW : ${subCat.count}</a>\n`
        })
    })
    const mailOptions = {
        from: keys.email,
        to: keys.notifyEmail,
        subject: 'NEW INTERESTS',
        html: message
    };
    console.log(`send email message = \n ${message}`)
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}