const {Validator, Messages} = require('../dist/index.cjs.js')
const messagesZh = require('../messages/zh.json')
Messages.zh = messagesZh


const examiner = new Validator({
    stringEmpty: true // 是否允许控制付出
})
const analysisData = data => {
    const values = {}
    const rules = {}
    for (const key in data) {
        const {value, rule} = data[key]
        values[key] = value
        rules[key] = rule
    }
    return {values, rules}
}

module.exports = {
    examiner,
    analysisData
}