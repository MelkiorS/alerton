const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubCategorySchema = require('./sub-category')


const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
    },
    subCategory : [SubCategorySchema]

})

module.exports = mongoose.model('Category', schema)