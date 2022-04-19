// const validator = require('validator')

const pkg =  require('../package.json')
const preRules = require('./rules.js')
const errorsZh = require('./errors/zh.js') // 中文错误提示
const errorsEn = require('./errors/en.js') // 英文错误提示
const METHOD_MAP = require('./method.js')

const ARRAY_SP = '__array__'
const OBJECT_SP = '__object__'
const WITHOUT_ERR_MESSAGE = ' valid failed'
const helper = require('./helper.js')
const {assert} = helper

class Validator {

    static version = pkg.version
    static rules = preRules
    // static validator = validator

    constructor(ctx, config = {}) {

        this.ctx = ctx // 仅 koa 后端架构中会存在 ctx，前端中没有 ctx
        this.version = pkg.version

        // 继承默认设置
        const options = helper.extend({
            requiredValidNames: ['required', 'requiredIf', 'requiredNotIf', 'requiredWith', 'requiredWithAll', 'requiredWithOut', 'requiredWithOutAll'], // “必传” 规则校验字段
            skippedValidNames: ['value', 'default', 'defaultDoc', 'trim', 'method', 'aliasName', 'title', 'placeholder', 'description', 'mode', 'allowNull'], // 运行跳过检查的字段
            // value -> 校验值
            // default -> 默认值
            // defaultDoc -> 在接口文档中的默认值，若不存在则取 default
            // trim -> 自动去除头尾空格，仅 string = true 情况下有效
            // method -> 请求方式
            // title -> 中文 name （用于生产 error 错误）
            // description -> 在接口文档中字段说明
            // mode -> 检查模式（用与 Logic 模块，和本模块无关）
            basicType: ['int', 'string', 'float', 'array', 'object', 'boolean'], // 基本类型，最多既能同时存在一个
            language: 'zh' // 默认使用中文
        }, helper.isObject(config) ? config : {})

        // 赋值设置信息
        const {language} = options
        this.requiredValidNames = options.requiredValidNames
        this.skippedValidNames = options.skippedValidNames.concat(this.requiredValidNames) 
        this.basicType = options.basicType
        this.language = language
        
        // 设置语言包和报错信息
        const languages = {
            'zh': errorsZh,
            'en': errorsEn
        }
        this.errors = helper.extend({}, errorsZh)
        if (language && languages[language]) {
            this.errors = helper.extend(this.errors, languages[language])
        } else if (typeof language === 'object') {
            this.errors = helper.extend(this.errors, language)
        }
    }

    _getOriginArgName(argName) {
        if (argName.indexOf(ARRAY_SP) > -1) {
            const tmpRuleName = argName.split(ARRAY_SP);
            argName = tmpRuleName[0] + '[' + tmpRuleName[1] + ']';
        }
        if (argName.indexOf(OBJECT_SP) > -1) {
            const tmpRuleName = argName.split(OBJECT_SP);
            argName = tmpRuleName[0] + '.' + tmpRuleName[1];
        }
        return argName;
    }

    _isErrorType(error) {
        return error && (helper.isString(error) || helper.isFunction(error)) // error 信息是允许 function handler
    }

    // 验证失败后，用于获取失败提示信息
    _getErrorMessage({argName, rule, rules, validName, parsedValidValue}, errType = '') {
        let errMsg = '';
        if (this.requiredValidNames.indexOf(validName) > -1) {
            validName = 'required';
        }
        if (argName.indexOf(ARRAY_SP) > -1) {
            argName = argName.split(ARRAY_SP)[0];
        }

        // 取验证名，一般验证名都会存在
        if (errType && this._isErrorType(this.errors[`${validName}:${errType}`])) {
            errMsg = this.errors[`${validName}:${errType}`]
        } else if (this._isErrorType(this.errors[validName])) {
            errMsg = this.errors[validName]
        }

        // const validNameError = this.errors[validName] // 验证名
        // if (this._isErrorType(validNameError)) {
        //     errMsg = validNameError;
        // }

        let argNameError = this.errors[argName] // 字段名（如果字段名存在，则优先使用）
        if (this._isErrorType(argNameError)) {
            errMsg = argNameError;
        }

        // [error message]: { username: { string: 'the error message' } }
        if (helper.isObject(argNameError)) {
            const validArgNameError = this.errors[argName][validName];  // 字段名 + 验证名（如果字段名 + 验证名存在，则高优先级使用）
            if (this._isErrorType(validArgNameError)) {
                errMsg = validArgNameError;
            }
        }


        if (argName.indexOf(OBJECT_SP) > -1) {
            const parsedResult = argName.split(OBJECT_SP); // eg: argName: address__object__province after pretreating(just one rule split from address)
            argName = parsedResult[0]; // eg: address
            const subRuleName = parsedResult[1]; // eg: province
            argNameError = this.errors[argName]; // eg: address

            if (helper.isObject(argNameError)) {
                errMsg = argNameError[validName];
                for (const i in argNameError) {
                    if (i.split(',').indexOf(subRuleName) > -1) {
                        if (helper.isObject(argNameError[i])) {
                            if (this._isErrorType(argNameError[i][validName])) {
                                errMsg = argNameError[i][validName];
                            }
                        } else if (this._isErrorType(argNameError[i])) {
                            errMsg = argNameError[i];
                        }
                    }
                }
            } else if (this._isErrorType(argNameError)) {
                errMsg = argNameError;
            }

            errMsg = errMsg || this.errors[validName];
        }

        const originArgName = this._getOriginArgName(argName);
        if (!errMsg) {
            return (rule.aliasName || originArgName) + WITHOUT_ERR_MESSAGE;
        }

        const validValue = rule[validName]

        // 支持自定义消息的功能
        // support function as the custom message
        if (helper.isFunction(errMsg)) {
            const lastErrorMsg = errMsg({
                name: originArgName,
                validName: validName,
                rule: rule,
                args: validValue,
                pargs: parsedValidValue
            })
            assert(helper.isString(lastErrorMsg), 'custom error function should return string.')
            return lastErrorMsg
        }

        // 拼装模板字符串
        const lastErrorMsg = errMsg.replace('{name}', rule.aliasName || originArgName)
            .replace('{title}', rules[argName].title || rule.aliasName || originArgName)
            .replace('{args}', helper.isString(validValue) ? validValue : JSON.stringify(validValue))
            .replace('{pargs}', helper.isString(parsedValidValue) ? parsedValidValue : JSON.stringify(parsedValidValue));
        return lastErrorMsg;
    }

    /**
     * 使用 validName 方法分析有效参数
     * 某些字段需要和另外一个字段进行交叉对比的，在 Rules 中提供 _ 函数
     * @return {Mixed} [description]
     */
    _parseValidValue(validName, rule, cloneRules, argName) {
        let validValue = rule[validName];
        const _fn = Validator.rules['_' + validName];

        // 支持重写回写，所以只需传递引用样式的数据而不进行克隆
        if (helper.isFunction(_fn)) {
            validValue = _fn(validValue, {
                argName,
                validName,
                currentQuery: this.ctx ? this.ctx[this._getRuleMethod(rule)]() : null,
                ctx: this.ctx,
                rule: rule,
                rules: cloneRules
            })
        }
        return validValue
    }

    /**
     * 按值类型转换值
     * @param  {String} argName [description]
     * @param  {Object} rule     [description]
     * @return {Mixed}          [description]
     */
    _convertArgValue(argName, rule, params) {
        const queryMethod = this._getRuleMethod(rule)
        const ruleCtxQuery = this.ctx ? this.ctx[queryMethod]() : params
        if ((rule.int || rule.float || rule.numeric) && queryMethod) {
            if (argName.indexOf(ARRAY_SP) > -1) {
                const parsedRuleName = argName.split(ARRAY_SP);
                ruleCtxQuery[parsedRuleName[0]][parsedRuleName[1]] = parseFloat(rule.value);
            } else if (argName.indexOf(OBJECT_SP) > -1) {
                const parsedRuleName = argName.split(OBJECT_SP);
                ruleCtxQuery[parsedRuleName[0]][parsedRuleName[1]] = parseFloat(rule.value);
            } else {
                ruleCtxQuery[argName] = parseFloat(rule.value);
            }
        }
    }

    /**
     * 如果需要，请检查值
     * @return {Boolean}      [description]
     */
    _isArgRequired(params) {
        let isRequired = false;
        const cloneRules = helper.extend({}, params.rules);
        for (let i = 0; i <= this.requiredValidNames.length; i++) {
            const validName = this.requiredValidNames[i];
            if (params.rule[validName]) {
                const fn = Validator.rules[validName];

                params.validName = validName;
                params.validValue = params.rule[validName];
                params.parsedValidValue = this._parseValidValue(validName, params.rule, cloneRules, params.argName);

                if (fn(params.rule.value, params)) {
                    isRequired = true;
                    break;
                }
            }
        }
        return isRequired;
    }

    /**
     * 获取规则启用方法
     * 仅在有 ctx 对象下有效
     * @param  {Object} rule - 验证规则
     * @return {String} ‘param’ or 'post'
     */
    _getRuleMethod(rule) {
        if (this.ctx) {
            if (typeof rule.method === 'undefined' || rule.method === '') {
                rule.method = this.ctx.method.toUpperCase()
            } else {
                rule.method = rule.method.toUpperCase()
            }
            return METHOD_MAP[rule.method] || 'param'
        }
        return null
    }

    /**
     * 预处理规则
     * 会自动从 ctx 或 params 获取 value 并合并到 rules 中并返回
     * @param {object} rules - 规则
     * @param {object} params - 外部参数
     */
    _preTreatRules(rules, params) {

        rules = helper.extend({}, rules)

        for (const argName in rules) {

            const rule = rules[argName] // 规则单条实例
            const queryMethod = this._getRuleMethod(rule) // 验证 method 类型，仅在有 ctx 对象下有效
            const ruleCtxQuery = this.ctx ? this.ctx[queryMethod]() : params // 获取需要验证的数据包

            // 一个字段仅能设置一个基本类型，否则会报错
            const containTypeNum = this.basicType.reduce((acc, val) => {
                val = rule[val] ? 1 : 0;
                return acc + val;
            }, 0)
            if (containTypeNum > 1) {
                throw new Error('Any rule can\'t contains one more basic type, the param you are validing is ' + argName)
            }

            // 获取验证值
            if (!rule.value) {
                rule.value = ruleCtxQuery[argName] // 根据规则的 key 获取 ctx 上的 value
            }

            // 仅在后端进行验证
            if (this.ctx) {
                
                if (typeof rule.value === 'undefined' || (rule.string && rule.value === "")) {
                    rule.value = rule.default // 若值无效则取规则中的默认值
                }
                if (rule.trim && rule.value && rule.value.trim) {
                    rule.value = rule.value.trim() // 去除头尾的空格
                }
                if (rule.array && !helper.isArray(rule.value)) {
                    // 数组类型转换
                    let isString = helper.isString(rule.value)
                    if (rule.value === '') {
                        rule.value = []
                    } else if (rule.value && isString) {
                        try {
                            rule.value = JSON.parse(rule.value)
                            if (!Array.isArray(rule.value)) {
                                rule.value = [rule.value] // 如果只传一个数字可能会被 number 化
                            }
                        } catch (e) {
                            if (rule.value.indexOf(',') > -1) {
                                rule.value = rule.value.split(',')
                            } else {
                                rule.value = [rule.value]
                            }
                        }
                    } else {
                        rule.value = null
                    }
                } else if (rule.object && !helper.isObject(rule.value)) {
                    // 对象类型转换
                    let isString = helper.isString(rule.value)
                    if (rule.value === '') {
                        rule.value = {}
                    } else if (rule.value && isString) {
                        try {
                            rule.value = JSON.parse(rule.value)
                        } catch (e) {
                            rule.value = null
                        }
                    } else {
                        rule.value = null
                    }
                } else if (rule.boolean && typeof rule.value !== 'undefined') {
                    // 布尔值类型转换
                    rule.value = ['yes', 'on', '1', 'true', true].indexOf(rule.value) > -1;
                } else if (!rule.string && rule.value === '') {
                    // 除了 rule.string = true 情况下，其他条件下不允许 value = ''
                    rule.value = undefined
                }
            }
            

            // 将转换过后的数据重新保存回 ctx 数据包
            if (typeof rule.value !== 'undefined') {
                if (argName.indexOf(ARRAY_SP) !== -1 || argName.indexOf(OBJECT_SP) !== -1) {
                    const parsedRuleName = argName.split(argName.indexOf(ARRAY_SP) === -1 ? OBJECT_SP : ARRAY_SP)
                    ruleCtxQuery[parsedRuleName[0]][parsedRuleName[1]] = rule.value
                } else {
                    ruleCtxQuery[argName] = rule.value
                }
            } else {
                ruleCtxQuery[argName] = undefined // 某些字段可能会重置为 undefined
            }
        }

        return helper.extend({}, rules)
    }

    /**
     * 动态新增规则
     * @param {String}   validName [description]
     * @param {Function} callback  [description]
     * @param {String}   msg       [description]
     */
    static addRule(validName, callback) {
        Validator.rules[validName] = callback
    }

    /**
     * 验证规则（核心接口，业务调用入口）
     * @param {Object} rules - 验证规则配置
     * @param {Object} msgs - 错误返回信息
     * @param {Object} _params 需要验证的参数，koa 下会自动从 ctx 中获取，其他情况需要手动传入
     * @return {Object} {[argName]: errorMessage} 如果返回空对象 {}，表示全部字段验证通过
     */
    validate(rules, msgs, _params) {
        
        let ret = {} // 返回体，如果某字段验证失败，错误信息将会记录在返回题中
        const cloneRules = helper.extend({}, rules) // 深拷贝一份规则
        const parsedRules = this._preTreatRules(rules, _params) // 对规则进行预处理，遍历所有规则，获取值后存储在 rule 的 value 中
        this.errors = helper.extend(this.errors, msgs) // 获取错误提示

        for (const argName in parsedRules) {

            const rule = parsedRules[argName]
            const params = {
                argName, rule, rules: cloneRules,
                currentQuery: this.ctx ? this.ctx[this._getRuleMethod(rule)]() : null,
                ctx: this.ctx
            }

            // 必选字段检查 required
            if (helper.isTrueEmpty(rule.value)) {
                if (this._isArgRequired(params)) {
                    for (let i = 0; i < this.requiredValidNames.length; i++) {
                        if (rule[this.requiredValidNames[i]]) {
                            const validName = this.requiredValidNames[i]
                            params.validName = validName
                            params.validValue = rule[validName]
                            params.parsedValidValue = this._parseValidValue(validName, rule, cloneRules, argName) // 解析有效值
                            break;
                        }
                    }
                    ret[argName] = this._getErrorMessage(params);
                    continue;
                } else {
                    continue;
                }
            }
           
            // 查询规则
            for (const validName in rule) {

                // 部分字段运行直接跳过检查
                if (this.skippedValidNames.indexOf(validName) >= 0) {
                    continue;
                }

                // 如果没有可用的检查方法，则直接抛出错误
                const fn = Validator.rules[validName]
                if (!helper.isFunction(fn)) {
                    throw new Error(validName + ' valid method is not been configed')
                }
                
                params.validName = validName
                params.validValue = rule[validName]
                params.parsedValidValue = this._parseValidValue(validName, rule, cloneRules, argName)
                
                const result = fn(rule.value, params) // 进行验证
                
                if (result === false || typeof result === 'string') {
                    // 验证失败
                    const originArgName = this._getOriginArgName(argName) // 原始参数名
                    ret[originArgName] = this._getErrorMessage(params, result) // 获取失败信息
                    break;
                } else if (helper.isObject(result)) { // custom valid failed for json-schema
                    ret = helper.extend({}, ret, result)
                    break;
                } else {
                    // 验证成功
                    this._convertArgValue(argName, rule, _params)
                }
            }
        }
        return ret
    }
}

module.exports = Validator