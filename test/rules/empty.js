const {examiner, analysisData} = require('../main')
const assert = require('power-assert')

describe('空参数', () => {

    describe('undefined', () => {
        it('default', () => {
            const data = {
                'int': {value: undefined, rule: {int: true}},
                'float': {value: undefined, rule: {float: true}},
                'boolean': {value: undefined, rule: {boolean: true}},
                'string': {value: undefined, rule: {string: true}},
                'array': {value: undefined, rule: {array: true}},
                'object': {value: undefined, rule: {object: true}}
            }
            const {rules, values} = analysisData(data)
            const res = examiner.checkup(rules, values)
            assert(!res.err && Object.keys(res.result).length === 0 && Object.keys(res.errors).length === 0)
        })
    })

    describe('null', () => {
        it('default', () => {
            const data = {
                'int': {value: null, rule: {int: true}},
                'float': {value: null, rule: {float: true}},
                'boolean': {value: null, rule: {boolean: true}},
                'string': {value: null, rule: {string: true}},
                'array': {value: null, rule: {array: true}},
                'object': {value: null, rule: {object: true}}
            }
            const {rules, values} = analysisData(data)
            const res = examiner.checkup(rules, values)
            assert(!res.err && Object.keys(res.result).length === 0 && Object.keys(res.errors).length === 0)
        })
        it('null', () => {
            const {rules, values} = analysisData({
                'int': {value: null, rule: {int: true, allowNull: true, required: true}},
                'float': {value: null, rule: {float: true, allowNull: true, requiredIf: ['int', null]}},
                'boolean': {value: null, rule: {boolean: true, allowNull: true, requiredNotIf: ['int', 'noNull']}},
                'string': {value: null, rule: {string: true, allowNull: true, requiredWith: ['int']}},
                'array': {value: null, rule: {array: true, allowNull: true, requiredWithAll: ['int']}},
                'object': {value: null, rule: {object: true, allowNull: true, requiredWithOut: 'int.undefined'}}
            })
            const res = examiner.checkup(rules, values)
            assert(!res.err && Object.keys(res.result).length === Object.keys(rules).length && Object.keys(res.errors).length === 0)
        })
        it('required', () => {
            const {rules, values} = analysisData({
                'valid': {value: 1, rule: {int: true}},
                'int': {value: null, rule: {int: true, required: true}},
                'float': {value: null, rule: {float: true, requiredIf: ['valid', 1]}},
                'boolean': {value: null, rule: {boolean: true, requiredNotIf: ['valid', false]}},
                'string': {value: null, rule: {string: true, requiredWith: ['valid']}},
                'array': {value: null, rule: {array: true, requiredWithAll: ['valid']}},
                'object': {value: null, rule: {object: true, requiredWithOut: ['valid.undefined']}}
            })
            const res = examiner.checkup(rules, values)
            assert(res.err && Object.keys(res.result).length === 1 && Object.keys(res.errors).length === Object.keys(rules).length - 1)
        })
    })

    describe('stringEmpty', () => {
        const {rules, values} = analysisData({
            'int': {value: '', rule: {int: true}},
            'float': {value: '', rule: {float: true}},
            'boolean': {value: '', rule: {boolean: true}},
            'string': {value: '', rule: {string: true}},
            'array': {value: '', rule: {array: true}},
            'object': {value: '', rule: {object: true}}
        })
        const res = examiner.checkup(rules, values, {stringEmpty: true})
        it('default', () => {
            for (const key of ['int', 'float', 'boolean', 'object']) {
                assert(!res.err && !res.result[`${key}`] && !res.errors[`${key}`])
            }
        })
        it('stringEmpty = true', () => {
            assert(!res.err && res.result['string'] === '' && Array.isArray(res.result['array']))
        })
        it('stringEmpty = false', () => {
            const res = examiner.checkup(rules, values, {stringEmpty: false})
            assert(!res.err && res.result['string'] === undefined && res.result['array'] === undefined)
        })
    })

})