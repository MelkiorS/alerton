const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    lang: String,
    translator: {
        type: Map,
        of: String
    }
});

module.exports = mongoose.model('Dictionary', schema)
