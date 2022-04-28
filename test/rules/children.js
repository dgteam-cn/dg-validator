const {examiner, analysisData} = require('../main')
const assert = require('power-assert')

describe('递归测试', () => {

    describe('递归数组', () => {
        it('correct', () => {
            const {rules, values} = analysisData({
                'correct.array.children': {value: ['1', '2', 'false'], rule: {array: true, children: {string: true}}},
                'correct.array.children.object': {
                    value: [{name: 'DG', age: 18}, {name: 'LF', age: 20}],
                    rule: {
                        array: {min: 1, max: 10},
                        children: {
                            object: true,
                            children: {
                                name: {string: true},
                                age: {int: {min: 1, max: 99}}
                            }
                        }
                    }
                },
                'correct.array.children.filter': {
                    value: [{name: 'DG', age: 18}, {name: 'LF', nickname: 'OMG'}],
                    rule: {
                        array: {min: 1, max: 10},
                        children: {
                            object: true,
                            children: {
                                name: {string: true},
                                age: {int: {min: 1, max: 99}}
                            }
                        }
                    }
                }
            })
            const res = examiner.checkup(rules, values)
            assert(!res.err && Object.keys(res.result).length === Object.keys(rules).length)
        })
        it('fail', () => {
            const {rules, values} = analysisData({
                'fail.array.children': {value: ['1', '2', false], rule: {array: true, children: {string: true}}},
                'fail.array.children.object': {
                    value: [{name: 'DG', age: 18}, {name: 'LF', age: 20}],
                    rule: {
                        array: {min: 1, max: 10},
                        children: {
                            object: true,
                            children: {
                                name: {string: true},
                                age: {int: {min: 1, max: 19}}
                            }
                        }
                    }
                }
            })
            const res = examiner.checkup(rules, values)
            assert(res.err && Object.keys(res.errors).length === Object.keys(rules).length)
        })
    })

    describe('递归对象', () => {
        it('correct', () => {
            const {rules, values} = analysisData({
                'correct.object.1': {value: {}, rule: {object: true}},
                'correct.object.2': {value: '{"Json": true}', rule: {object: true}},
                'correct.object.children': {
                    value: {name: 'DG', age: 18},
                    rule: {
                        object: true,
                        children: {
                            name: {string: true},
                            age: {int: {min: 1, max: 99}}
                        }
                    }
                },
                'correct.object.children.required': {
                    value: {name: 'DG'},
                    rule: {
                        object: true,
                        children: {
                            name: {string: true},
                            age: {int: {min: 1, max: 10}, required: false}
                        }
                    }
                }
            })
            const res = examiner.checkup(rules, values)
            assert(!res.err && Object.keys(res.result).length === Object.keys(rules).length)
        })
        it('fail', () => {
            const {rules, values} = analysisData({
                'fail.object.1': {value: false, rule: {object: true}},
                'fail.object.2': {value: "{}.", rule: {object: true}},
                'fail.object.3': {value: "{ab: 1}", rule: {object: true}},
                'fail.object.children': {
                    value: {name: 'DG', age: 18},
                    rule: {
                        object: true,
                        children: {
                            name: {string: true},
                            age: {int: {min: 1, max: 10}}
                        }
                    }
                },
                'fail.object.children.required': {
                    value: {name: 'DG'},
                    rule: {
                        object: true,
                        children: {
                            name: {string: true},
                            age: {int: {min: 1, max: 10}, required: true}
                        }
                    }
                }
            })
            const res = examiner.checkup(rules, values)
            assert(res.err && Object.keys(res.errors).length === Object.keys(rules).length)
        })
    })

})