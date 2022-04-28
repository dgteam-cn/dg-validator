const {examiner, analysisData} = require('../main')
const assert = require('power-assert')

describe('必要参数', () => {
    it('correct', () => {
        const {rules, values} = analysisData({
            'required': {value: 1, rule: {int: true, required: true}},
            'requiredIf': {value: 1, rule: {int: true, requiredIf: ['required', 1]}},
            'requiredNotIf': {value: 1, rule: {int: true, requiredNotIf: ['required', 'abc']}},
            'requiredWith': {value: 1, rule: {int: true, requiredWith: ['required']}},
            'requiredWithAll': {value: 1, rule: {int: true, requiredWithAll: ['required']}},
            'requiredWithOut': {value: 1, rule: {int: true, requiredWithOut: ['required', 'required.undefined']}},
            'requiredWithOutAll': {value: 1, rule: {int: true, requiredWithOutAll: ['required.undefined']}}
        })
        const res = examiner.checkup(rules, values)
        assert(!res.err && Object.keys(res.result).length === Object.keys(rules).length)
    })
    it('fail', () => {
        const {rules, values} = analysisData({
            'required': {value: 1, rule: {int: true, required: true}},
            'requiredIf': {value: undefined, rule: {int: true, requiredIf: ['required', 1]}},
            'requiredNotIf': {value: undefined, rule: {int: true, requiredNotIf: ['required', 'abc']}},
            'requiredWith': {value: undefined, rule: {int: true, requiredWith: ['required']}},
            'requiredWithAll': {value: undefined, rule: {int: true, requiredWithAll: ['required']}},
            'requiredWithOut': {value: undefined, rule: {int: true, requiredWithOut: ['required', 'required.undefined']}},
            'requiredWithOutAll': {value: undefined, rule: {int: true, requiredWithOutAll: ['required.undefined']}}
        })
        const res = examiner.checkup(rules, values)
        assert(res.err && Object.keys(res.errors).length === Object.keys(rules).length - 1)
    })
    it('ignore', () => {
        const {rules, values} = analysisData({
            'required': {value: 1, rule: {int: true, required: true}},
            'requiredIf': {value: undefined, rule: {int: true, requiredIf: ['required', 'abc']}},
            'requiredNotIf': {value: undefined, rule: {int: true, requiredNotIf: ['required', 1]}},
            'requiredWith': {value: undefined, rule: {int: true, requiredWith: ['required.undefined']}},
            'requiredWithAll': {value: undefined, rule: {int: true, requiredWithAll: ['required.undefined']}},
            'requiredWithOut': {value: undefined, rule: {int: true, requiredWithOut: ['required']}},
            'requiredWithOutAll': {value: undefined, rule: {int: true, requiredWithOutAll: ['required']}}
        })
        const res = examiner.checkup(rules, values)
        assert(!res.err && Object.keys(res.result).length === 1 && Object.keys(res.errors).length === 0)
    })

})