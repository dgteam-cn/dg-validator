import {Rules} from './rules.js'
import {assert, extend, isTrueEmpty, isString, isObject, isArray, isFunction} from './helper.js'

const Messages = {}

/**
 * @class 验证器
 */
class Validator {

    /**
     * @param {Object} config - 配置对象
     * @param {Array<String>} config.ignoreRuleKeys - 需要忽略验证的规则 keys
     * @param {String} config.locale - 默认绑定的语言（若未指定 config.messages 会尝试从 ValidatorErrors 中获取）
     * @param {Number} config.strict - 是否严格检测字段（使用 http 等协议进行数据交互时，可能存在某些字段会被转换成字符串，禁用 strict 模式可以提升兼容性，建议后端关闭严格模式）
     */
    constructor(config = {}) {

        // 继承默认设置
        const opts = extend({
            ignoreRuleKeys: extend([], config.ignoreRuleKeys), // origin: ['value', 'default', 'trim', 'method', 'aliasName']; engine: ['title', 'placeholder', 'defaultDoc', 'description', 'mode']; new: ['title']
            locale: 'zh', // 默认使用中文
            strict: false, // 是否启用严格模式
            stringEmpty: true, // 是否允许空字符串，当 '' 是否被判定为 undefined 处理（非 rule.string 与 rule.array 会强制以 undefined 处理）
            assert: undefined // [未实装] 断言库
        }, isObject(config) ? config : {})

        // 赋值设置信息locale
        this.basicType = ['int', 'string', 'float', 'array', 'object', 'boolean'] // 基本类型，最多既能同时存在一个
        this.requiredValidNames = ['required', 'requiredIf', 'requiredNotIf', 'requiredWith', 'requiredWithAll', 'requiredWithOut', 'requiredWithOutAll'] // 必穿参数验证
        this.ignoreRuleKeys = ['value', 'default', 'trim', 'aliasName', 'children', 'allowNull'].concat(this.requiredValidNames).concat(opts.ignoreRuleKeys)
        this.locale = opts.locale
        this.strict = opts.strict // 是否严格模式
        this.stringEmpty = opts.stringEmpty
        this.assert = opts.assert
    }


    /**
     * 验证失败后，用于获取失败提示信息
     * @param {*} param
     * @param {String} errType - 错误类型
     * @returns
     */
    _getErrorMessage({argName, rule, validName, parsedValidValue}, {messages = {}, locale, errType = ''} = {}) {

        const _isErrorType = error => error && (isString(error) || isFunction(error)) // error 信息是允许 function handler
        if (this.requiredValidNames.indexOf(validName) > -1) {
            validName = 'required'
        }

        // 取验证名，一般验证名都会存在
        const getMessagesString = messages => {
            if (argName) {

            }
            if (errType && _isErrorType(messages[`${validName}:${errType}`])) {
                return messages[`${validName}:${errType}`]
            } else if (_isErrorType(messages[validName])) {
                return messages[validName]
            }
        }
        let errMsg = getMessagesString(messages)
        if (!errMsg) {
            if (!locale) locale = this.locale
            if (locale && isObject(Messages[locale])) {
                errMsg = getMessagesString(Messages[locale])
            }
        }

        // const validNameError = this.errors[validName] // 验证名
        // if (_isErrorType(validNameError)) {
        //     errMsg = validNameError;
        // }

        // let argNameError = this.errors[argName] // 字段名（如果字段名存在，则优先使用）
        // if (_isErrorType(argNameError)) {
        //     errMsg = argNameError;
        // }

        // // [error message]: { username: { string: 'the error message' } }
        // if (isObject(argNameError)) {
        //     const validArgNameError = this.errors[argName][validName];  // 字段名 + 验证名（如果字段名 + 验证名存在，则高优先级使用）
        //     if (_isErrorType(validArgNameError)) {
        //         errMsg = validArgNameError;
        //     }
        // }

        if (!errMsg) {
            return (rule.aliasName || argName) + ' valid failed'
        }

        const validValue = rule[validName]

        // 支持自定义消息的功能
        // support function as the custom message
        if (isFunction(errMsg)) {
            const lastErrorMsg = errMsg({
                name: argName,
                validName: validName,
                rule: rule,
                args: validValue,
                pargs: parsedValidValue
            })
            assert(isString(lastErrorMsg), 'custom error function should return string.')
            return lastErrorMsg
        }

        // 拼装模板字符串
        const lastErrorMsg = errMsg.replace('{name}', rule.aliasName || argName)
            .replace('{args}', isString(validValue) ? validValue : JSON.stringify(validValue))
            .replace('{pargs}', isString(parsedValidValue) ? parsedValidValue : JSON.stringify(parsedValidValue))
        return lastErrorMsg
    }

    /**
     * 使用 validName 方法分析有效参数
     * 某些字段需要和另外一个字段进行交叉对比的，在 Rules 中提供 _ 函数
     * @return {Mixed} [description]
     */
    _parseValidValue({validName, rule, rules, argName, ctx}) {
        const validValue = rule[validName]
        const _fn = Rules['_' + validName]
        return isFunction(_fn) ? _fn(validValue, {argName, validName, ctx, rule: rule, rules}) : validValue
    }


    /**
     * 如果需要，请检查值
     * @return {Boolean}      [description]
     */
    _isArgRequired(gather) {
        let isRequired = false;
        for (let i = 0; i <= this.requiredValidNames.length; i++) {
            const validName = this.requiredValidNames[i]
            if (gather.rule[validName]) {
                const fn = Rules[validName]

                gather.validName = validName
                gather.validValue = gather.rule[validName]
                gather.parsedValidValue = this._parseValidValue({validName, rule: gather.rule, rules: gather.rules, argName: gather.argName, ctx: gather.ctx})

                if (fn(gather.rule.value, gather)) {
                    isRequired = true
                    break
                }
            }
        }
        return isRequired
    }

    /**
     * 预处理规则
     * 会自动从 ctx 或 params 获取 value 并合并到 rules 中并返回
     * @param {Object} rules - 规则
     * @param {Object} gather - 外部参数
     * @param {Boolean} opts.isDeep - 是否为深度对象
     * @param {Boolean} opts.stringEmpty - 是否允许空字符串（不允许会以 undefined 处理）
     */
    _preTreatRules(originRules, gather, {isDeep, stringEmpty} = {}) {
        const rules = {}
        const _gather = isDeep ? gather : extend({}, gather) // 深层对象保留引用关系
        for (const argName in originRules) {
            const value = _gather[argName]
            rules[argName] = this._preTreatRule(originRules[argName], value, argName, {stringEmpty}) // 规则单条实例
        }
        return rules
    }
    _preTreatRule(originRule, value, argName, {stringEmpty} = {}) {

        const rule = extend({}, originRule)

        // 一个字段仅能设置一个基本类型，否则会报错
        const containTypeNum = this.basicType.reduce((acc, val) => {
            val = rule[val] ? 1 : 0
            return acc + val
        }, 0)

        if (containTypeNum > 1) {
            throw new Error('Any rule can\'t contains one more basic type, the param you are validing is ' + argName)
        }

        if (rule.value === undefined) {
            rule.value = value  // 获取验证值
        }

        if (!this.strict) {

            if ((rule.value === undefined || rule.string && rule.value === '') && rule.default !== undefined) {
                rule.value = rule.default // 若值无效则取规则中的默认值（null 属于有效值，所以仅判断 undefined 和 ''）
            }
            if (rule.value === '' && !rule.string) {
                if (stringEmpty && rule.array) {
                    rule.value = [] // 特殊规则，如果是空字符串，会自动转为空数组
                } else {
                    rule.value = undefined // 除了 rule.string = true 情况下，其他条件 value = '' 时转换为 undefined
                }
            }
            if (rule.string) {
                // 字符串预处理
                if (typeof rule.value !== 'string' && rule.value && typeof rule.value.toString === 'function') {
                    rule.value = rule.value.toString() // 自动转为字符串
                }
                if (rule.trim && rule.value && typeof rule.value.trim === 'function') {
                    rule.value = rule.value.trim() // 去除头尾的空格
                }
            } else if (rule.boolean) {
                // 布尔值类型转换
                if (rule.value !== undefined) {
                    if ([true, 'true', 'True', 'TRUE', '1', 1].indexOf(rule.value) > -1) {
                        rule.value = true
                    } else if ([false, 'false', 'False', 'FALSE', '0', 0].indexOf(rule.value) > -1) {
                        rule.value = false
                    }
                }
            } else if (rule.array) {
                // 数组预处理
                if (!isArray(rule.value)) {
                    // 数组类型转换
                    if (rule.value && isString(rule.value)) {
                        try {
                            rule.value = JSON.parse(rule.value)
                            if (!isArray(rule.value)) {
                                rule.value = [rule.value] // 如果只传一个数字可能会被 number 化
                            }
                        } catch (e) {
                            if (rule.value.indexOf(',') > -1) {
                                rule.value = rule.value.split(',')
                            } else {
                                rule.value = [rule.value]
                            }
                        }
                    }
                }
            } else if (rule.object) {
                // 对象类型转换
                if (!isObject(rule.value)) {
                    if (rule.value && isString(rule.value)) {
                        try {
                            rule.value = JSON.parse(rule.value)
                        } catch (e) {}
                    }
                }
            }
        }
        return rule
    }


    /**
     * 验证规则（核心接口，业务调用入口）
     * @param {Object} rules - 验证规则配置
     * @param {Object} msgs - 错误返回信息
     * @param {Object} params 需要验证的参数，koa 下会自动从 ctx 中获取，其他情况需要手动传入
     * @param {Object} opts.messages 错误消息模板文件
     * @return {Object} {[argName]: errorMessage} 如果返回空对象 {}，表示全部字段验证通过
     */
    validate(rules, params, {messages, locale, stringEmpty, ctx} = {}) {

        if (stringEmpty === undefined) stringEmpty = this.stringEmpty

        const deepInspect = (rules, params, path = '') => {
            const paths = path ? path.split('.') : []
            const level = paths.length

            const result = {} // 已验证成功的字段（存在于 params 但没有验证的不会出现在 result 对象中）
            const errors = {} // 返回体，如果某字段验证失败，错误信息将会记录在返回题中

            const parsedRules = this._preTreatRules(rules, params, {isDeep: level > 0, stringEmpty}) // 对规则进行预处理，遍历所有规则，获取值后存储在 rule 的 value 中
            for (const argName in parsedRules) {

                const rule = parsedRules[argName]
                const gather = {argName, rule, rules: parsedRules, ctx, path}

                if (isTrueEmpty(rule.value)) {
                    if (this._isArgRequired(gather)) {
                        for (let i = 0; i < this.requiredValidNames.length; i++) {
                            if (rule[this.requiredValidNames[i]]) {
                                const validName = this.requiredValidNames[i]
                                gather.validName = validName
                                gather.validValue = rule[validName]
                                gather.parsedValidValue = this._parseValidValue({validName, rule, rules: parsedRules, argName, ctx}) // 解析有效值
                                break
                            }
                        }
                        errors[argName] = this._getErrorMessage(gather)
                    }
                    if (stringEmpty && rule.string && rule.value === '') {
                        if (errors[argName]) {
                            continue
                        } else {
                            //   result[argName] = '' // string 类型下的 '' 也要赋予在 result 中
                        }
                    } else {
                        continue
                    }
                }

                // 验证单一字段所有规则
                const deepInspectRule = (rule, parsedRules, gather, argName) => {

                    for (const validName in rule) {

                        if (rule.allowNull && rule.value === null) {
                            continue // 该字段允许为 null 且的确为 null 则跳过检查（字符串的 'null' 无法通过）
                        } else if (this.ignoreRuleKeys.indexOf(validName) >= 0) {
                            continue // 部分字段运行直接跳过检查
                        }

                        const fn = Rules[validName]  // 如果没有对应的检查方法，则直接抛出错误
                        if (!isFunction(fn)) throw new Error(`"${validName}" valid method is not been configed`)

                        gather.validName = validName
                        gather.validValue = rule[validName]
                        if (parsedRules) gather.parsedValidValue = this._parseValidValue({validName, rule, rules: parsedRules, argName, ctx}) // 有些字段需要和另一个字段进行对比的， parsedValidValue 为需要对比的有效值

                        const verified = fn(rule.value, gather) // 进行验证, 返回 false string object 都算失败，返回 undefined null true 等为成功

                        if (verified === false || typeof verified === 'string') {
                            return {[argName]: this._getErrorMessage(gather, {messages, locale, errType: verified})} // 获取失败信息
                        } else if (isObject(verified)) {
                            return verified
                        }

                        // 检查深度对象
                        if (rule.object && rule.value && isObject(rule.children)) {
                            const nextPath = `${path}${path ? '.' : ''}${argName}`
                            const res = deepInspect(rule.children, rule.value, nextPath)
                            if (!res.err) {
                                rule.value = res.result
                            } else {
                                const errors = {}
                                Object.keys(res.errors).forEach(key => {
                                    errors[`${argName}.${key}`] = res.errors[key]
                                })
                                return errors
                            }
                        } else if (rule.int || rule.float || rule.numeric) {
                            // 把已经成功验证的 int 与 float 进行转化
                            rule.value = parseFloat(rule.value)
                        }
                    }
                }

                const ruleErrors = deepInspectRule(rule, parsedRules, gather, argName)
                if (!ruleErrors || Object.keys(ruleErrors).length === 0) {
                    if (isObject(rule.children) && rule.value && rule.array) {
                        if (rule.array) {
                            let subValidPass = true
                            const values = []
                            for (let index = 0; index < rule.value.length; index ++ ) {
                                const item = rule.value[index]
                                const nextPath = `${path}${path ? '.' : ''}${argName}.${index}`
                                const parsedRule = this._preTreatRule(rule.children, item, nextPath, {stringEmpty})
                                const gather = {argName: nextPath, rule: parsedRule, rules: {children: parsedRule}, ctx, path: nextPath}
                                const childrenErrors = deepInspectRule(parsedRule, null, gather, nextPath)
                                if (childrenErrors && Object.keys(childrenErrors).length > 0) {
                                    Object.keys(childrenErrors).forEach(key => {
                                        errors[key] = childrenErrors[key]
                                    })
                                    subValidPass = false
                                    break
                                }
                                values.push(parsedRule.value)
                            }
                            if (subValidPass) {
                                result[argName] = values
                            }
                        }
                    } else {
                        result[argName] = rule.value
                    }
                } else {
                    Object.keys(ruleErrors).forEach(key => {
                        errors[key] = ruleErrors[key]
                    })
                }
            }

            const err = Object.keys(errors).length > 0 ? 1 : 0
            return {err, result, errors}
        }

        return deepInspect(rules, params)
    }
    checkup() {
        return this.validate(...arguments)
    }
}

// 声明静态属性
Validator.Messages = Messages
Validator.Rules = Rules

export {
    Validator,
    Messages,
    Rules
}