const {examiner, analysisData} = require('../main')
const assert = require('power-assert')

describe('参数兼容性测试', () => {

    const {rules, values} = analysisData({
        'number.string': {value: 123, rule: {string: true}},
        'boolean.string': {value: true, rule: {string: true}},
        'array.string': {value: ['1'], rule: {string: true}},
        'object.string': {value: {}, rule: {string: true}},
        'string.int': {value: '1', rule: {int: true}},
        'string.float': {value: '1.25', rule: {float: true}},
        'string.boolean': {value: 'false', rule: {boolean: true}},
        'string.array': {value: "[1]", rule: {array: true}},
        'string.object': {value: "{}", rule: {object: true}},
        'children.string.int': {value: {age: '66'}, rule: {object: true, children: {age: {int: true}}}}
    })
    const res = examiner.checkup(rules, values)

    it('correct', () => {
        assert(!res.err && Object.keys(res.result).length === Object.keys(rules).length && Object.keys(res.errors).length === 0)
    })
    it('parse', () => {
        it('string => int', () => assert(typeof res.result['string.int'] === 'number'))
        it('string => float', () => assert(typeof res.result['string.float'] === 'number'))
        it('string => boolean', () => assert(typeof res.result['string.boolean'] === 'boolean'))
        it('number => string', () => assert(typeof res.result['number.string'] === 'string'))
        it('string => array', () => assert(typeof res.result['string.array'] === 'object' && res.result['string.array'].length >= 0))
        it('string => object', () => assert(typeof res.result['string.object'] === 'object'))
        it('children | string => object', () => assert(typeof res.result['children.string.int'].age === 'number'))
    })
    it('fail', () => {
        const {rules, values} = analysisData({
            'symbol.int': {value: Symbol('symbol'), rule: {int: true}},
            'function.int': {value: new Function(), rule: {int: true}},
            'string.int': {value: '1a', rule: {int: true}},
            'boolean.int': {value: true, rule: {int: true}},
            'array.int': {value: [], rule: {int: true}},
            'object.int': {value: {}, rule: {int: true}},
            'int.object': {value: 1, rule: {object: true}},
            'int.array': {value: 1, rule: {object: true}}
        })
        const res = examiner.checkup(rules, values)
        assert(res.err && Object.keys(res.result).length === 0 && Object.keys(res.errors).length === Object.keys(rules).length)
    })
})