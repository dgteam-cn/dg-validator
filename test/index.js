const Validator = require('../src/index.js')

const data = {
    // 'int.transform.empty': '',
    // 'int.correct': 10,
    // 'int.correct.min': 10,
    // 'int.correct.max': 10,
    // 'int.fail.min': 1,
    // 'int.fail.max': 100,

    'float.fail.min': 1,
    'float.fail.max': 101,
    'float.fail.decimal': 10.55,

    'in.transform.empty': '',
    'in.correct': 1,
    'in.fail': 0,

    // 'date.transform.empty': '',

    // // boolean 转变, 只有 1 "true" 转译为 true，其他都转译为 false
    // 'boolean.transform.empty': '',
    // 'boolean.transform.1': 1,
    // 'boolean.transform.str.1': '1',
    // 'boolean.transform.str.true': 'true',
    // 'boolean.transform.0': 0,
    // 'boolean.transform.str.0': 0,
    // 'boolean.transform.str.false': 'false',
    // 'boolean.transform.123': '123',
    // 'boolean.transform.str.123': 123,
    // 'boolean.transform.object': {},

    // 'array.transform.empty': '',
    // 'array.transform.string': '123,456',
    // 'array.transform.json': '[{"a":1,"b":2}]',
    // 'array.correct.min': [1, 2],
    // 'array.correct.max': [1, 2],
    // 'array.fail.min': [1],
    // 'array.fail.max': [1, 2, 3],
}
const examiner = new Validator({
    method: 'POST',
    post() {
        return data
    }
}, {
    language: 'zh'
})
const rules = {
    // 'int.transform.empty': {int: true},
    // 'int.correct': {int: true},
    // 'int.correct.min': {int: {min: 5}},
    // 'int.correct.max': {int: {max: 30}},
    // 'int.fail.min': {int: {min: 5}},
    // 'int.fail.max': {int: {max: 30}},

    'float.fail.min': {float:{min: 10, max: 100, decimal: 1}},
    'float.fail.max': {float:{min: 10, max: 100, decimal: 1}},
    'float.fail.decimal': {float:{min: 10, max: 100, decimal: 1}},

    'in.transform.empty': {in: [1, 2, 3], default: 1},
    'in.correct': {in: [1, 2, 3]},
    'in.fail': {in: [1, 2, 3]},

    //'date.transform.empty': {date: true},

    // 'boolean.transform.empty': {boolean: true},
    // 'boolean.transform.1': {boolean: true},
    // 'boolean.transform.str.1': {boolean: true},
    // 'boolean.transform.str.true': {boolean: true},
    // 'boolean.transform.0': {boolean: true},
    // 'boolean.transform.str.0': {boolean: true},
    // 'boolean.transform.str.false': {boolean: true},
    // 'boolean.transform.123': {boolean: true},
    // 'boolean.transform.str.123': {boolean: true},
    // 'boolean.transform.object': {boolean: true},

    // 'array.transform.empty': {array: true},
    // 'array.transform.string': {array: true},
    // 'array.transform.json': {array: true},
    // 'array.correct.min': {array: {min: 2, max: 2}},
    // 'array.correct.max': {array: {min: 2, max: 2}},
    // 'array.fail.min': {array: {min: 2, max: 2}},
    // 'array.fail.max': {array: {min: 2, max: 2}}
    //
}
const msgs = {}

console.log('\n', examiner.validate(rules, msgs), '\n', data)