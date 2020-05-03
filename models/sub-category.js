const mongoose = require('mongoose')
const Schema = mongoose.Schema

 const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    deals: {
        type: Number,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
     count: {
        type: Number,
         required: false
     }

})

// module.exports = mongoose.model('SubCategories', schema)

module.exports = schema;