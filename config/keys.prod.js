module.exports = {
    baseURL: process.env.BASE_URL,
    section: process.env.SECTION,
    fullURL: function () {
        return this.baseURL.trim() + this.section.trim()
    },
    mongodb: process.env.MONGO_DB,
    checkMinutes: process.env.CHECK_MINUTES,
    email: process.env.EMAIL,
    emailPwd: process.env.EMAIL_PWD,
    notifyEmail: process.env.NOTIFY_EMAIL,
    wakeUpUrl: process.env.WAKE_UP_URL,
    wakeUpPeriod: process.env.WAKE_UP_PERIOD,
    botToken: process.env.BOT_TOKEN,
    botMsgId: process.env.BOT_MSG_ID
}