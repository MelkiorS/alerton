module.exports = {
    baseURL: process.env.BASE_URL,
    section: process.env.SECTION,
    fullURL: function () {
        return this.baseURL.trim() + this.section.trim()
    },
    mongodb: process.env.MONGO_DB,
    checkMinutes: process.env.CHECK_MINUTES
}