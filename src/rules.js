import isContains from 'validator/lib/contains'
import isBase64 from 'validator/lib/isBase64'
import isCreditCard from 'validator/lib/isCreditCard'
import isMobilePhone from 'validator/lib/isMobilePhone'
import isISO8601 from 'validator/lib/isISO8601'
import isEmail from 'validator/lib/isEmail'
import isInt from 'validator/lib/isInt'
import isFloat from 'validator/lib/isFloat'

import isHexadecimal from 'validator/lib/isHexadecimal'
import isHexColor from 'validator/lib/isHexColor'
import isRgbColor from 'validator/lib/isRgbColor'

import isIP from 'validator/lib/isIP'
import isUUID from 'validator/lib/isUUID'
import isHash from 'validator/lib/isHash'
import isMimeType from 'validator/lib/isMimeType'
import isMongoId from 'validator/lib/isMongoId'
import isLength from 'validator/lib/isLength' // 只能坚持字符串长度是否在指定值内（自动判断 UTF-16 的代理对）
import isBoolean from 'validator/lib/isBoolean' // [true, false, 'true', 'false', 1, 0] 等都符合匹配

import * as helper from './helper.js'
const {assert, isTrueEmpty, isString, isNumber, isArray, isObject, isRegExp} = helper
const isStringOrNumber = obj => isString(obj) || isNumber(obj)

/**
 * 可对主体类的 rules 进行添加或覆盖原规则
 * @param {string} argName               - 用户提交参数名
 * @param {any}    value                 - 用户提交参数值
 * @param {object} opts                  - 验证规则参数
 * @param {string} opts.validName        - 验证器验证规则名称
 * @param {any}    opts.validValue       - 验证器验证规则参数（配置）
 * @param {any}    opts.parsedValidValue - 部分规则需要其他字段的 value 值进行对比，该值是已经获取好的对比值
 * @param {object} opts.ctx              - 上下文对象，仅在后端有效
 * @param {object} opts.rule             - 用户提交字段对应的本次规则
 * @param {object} opts.rules            - 用户提交字段对应的所有规则
 *
 * const params = {
 *     price: 150.6      <- value
 * }
 * const rules = {
 *     price: {          <- argName     -|          -|
 *         float: {      <- validName    | rule[0]   | rules: Array<rule>
 *             min: 50   <- validName   -|           |
 *         }                                         |
 *     },                                            |
 *     title: {                         -|           |
 *         string: true                  | rule[1]   |
 *     }                                -|          -|
 * }
 * Validator.validate(rules, {}, params)
 */

const Rules = {}

Rules.required = () => true
Rules._requiredIf = (validValue, {rules}) => {
    assert(isArray(validValue), 'requiredIf\'s value should be array')
    validValue = validValue.slice()
    validValue[0] = rules[validValue[0]].value
    return validValue
}
Rules.requiredIf = (value, {parsedValidValue}) => {
    const first = parsedValidValue[0]
    const others = parsedValidValue.slice(1)
    return others.indexOf(first) > -1
}
Rules._requiredNotIf = (validValue, {rules}) => {
    assert(isArray(validValue), 'requiredNotIf\'s value should be array')
    return Rules._requiredIf(validValue, {rules})
}
Rules.requiredNotIf = (value, {parsedValidValue}) => {
    const first = parsedValidValue[0]
    const others = parsedValidValue.slice(1)
    return others.indexOf(first) === -1
}
Rules._requiredWith = (validValue, {rules}) => {
    assert(isArray(validValue), 'requiredWith\'s value should be array')
    validValue = validValue.slice()
    return validValue.map(item => !isTrueEmpty(rules[item] && rules[item].value) ? rules[item].value : '')
}
Rules.requiredWith = (value, {parsedValidValue}) => parsedValidValue.some(item => !isTrueEmpty(item))
Rules._requiredWithAll = (validValue, {rules}) => {
    assert(isArray(validValue), 'requiredWithAll\'s value should be array')
    return Rules._requiredWith(validValue, {rules})
}
Rules.requiredWithAll = (value, {parsedValidValue}) => parsedValidValue.every(item => !isTrueEmpty(item))
Rules._requiredWithOut = (validValue, {rules}) => {
    assert(isArray(validValue), 'requiredWithOut\'s value should be array')
    return Rules._requiredWith(validValue, {rules})
}
Rules.requiredWithOut = (value, {parsedValidValue}) => parsedValidValue.some(item => isTrueEmpty(item))
Rules._requiredWithOutAll = (validValue, {rules}) => {
    assert(isArray(validValue), 'requiredWithOutAll\'s value should be array')
    return Rules._requiredWith(validValue, {rules})
}
Rules.requiredWithOutAll = (value, {parsedValidValue}) => parsedValidValue.every(item => isTrueEmpty(item))

// 值必须包含某个特性的对象，类似 indexOf
Rules.contains = (value, {validValue}) => {
    assert(isStringOrNumber(validValue), 'contains should be string or number')
    return isString(value) && isContains(value, validValue) // ignoreCase = 比较时忽略大小写; minOccurences = 最小出现的次数
}

Rules._equals = (validValue, {rules}) => rules[validValue].value
Rules.equals = (value, {parsedValidValue}) => value === parsedValidValue // 值必须和另外一个值相等
Rules._different = (validValue, {rules}) => Rules._equals(validValue, {rules})
Rules.different = (value, {parsedValidValue}) => value !== parsedValidValue // 和另一项的值不等

// 值只能是 [a-zA-Z] 组成
Rules.alpha = value => isString(value) && /^[A-Z]+$/i.test(value)

// 值只能是 [a-zA-Z_] 组成
Rules.alphaDash = value => isString(value) && /^[A-Z_]+$/i.test(value)

// 值只能是 [a-zA-Z0-9] 组成
Rules.alphaNumeric = value => isStringOrNumber(value) && /^[0-9A-Z]+$/i.test(String(value))

// 值只能是 [a-zA-Z0-9_] 组成
Rules.alphaNumericDash = value => isStringOrNumber(value) && /^\w+$/i.test(String(value))

// 值只能是 ascii 字符组成
// eslint-disable-next-line no-control-regex
Rules.ascii = value => isString(value) && /^[\x00-\x7F]+$/.test(value)

// 值必须是 base64 编码
Rules.base64 = (value, {validValue}) => isString(value) && isBase64(String(value), {urlSafe: !!(isObject(validValue) && (validValue.urlSafe || validValue.url))}) // urlSafe 是否 URL 安全

// 需要为信用卡数字
Rules.creditCard = value => {
    value = String(value)
    return isCreditCard(value)
}

// 需要为日期 yyyy-MM-dd 或 yyyy/MM/dd
function isValidDateString(dateStr) {
    if (typeof dateStr !== 'string') return false
    dateStr = dateStr.replace(/-/g, '/') // 为了兼容苹果系统把日期的 "-" 换成 "/"
    return new Date(dateStr).getDate() == dateStr.split(' ')[0].substring(8) // 如果日期时间的 day 与文本时间的 day 相同表示该日期有效
}
Rules.date = (value, {validValue}) => {
    const strict = typeof validValue === 'object' ? Boolean(strict) : false // 是否为严格时间，如果为否仅验证格式不验证日期
    // const min before // 最小日期，会自动序列化，输入日期必须比该时间大
    // const max after // 最大日期，会自动序列化，输入日期必须比该时间小
    // return dataCheker(value) // !isNaN(Date.parse(value))
    value = String(value)
    const flag = /^[1-3]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value)
    if (!flag) return false
    if (strict && !isValidDateString(value)) return false
    return true
}
// 需要为时间 hh:mm:ss
Rules.time = (value) => {
    // const min // or 'start' 最小时间，输入时间总秒数必须比该时间大
    // const max // or 'end' 最大时间，输入时间总秒数必须比该时间小
    // const step // 步进值（意义不大），所选时间必须是步进值的倍数
    // const format // 时间格式：12小时制 或 24小时制（默认）
    value = String(value)
    const flag = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(value)
    if (!flag) return false
    return true
}
// 需要为日期时间 yyyy-MM-dd hh:mm:ss
Rules.datetime = (value) => {
    // const strict 是否为严格时间，如果为否仅验证格式不验证日期
    // const format // 时间格式：12小时制 或 24小时制（默认）
    value = String(value)
    const flag = /^[1-3]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(value)
    if (!flag) return false
    // if (strict && !isValidDateString(value)) return false
    return true
}
// 需要为日期范围 yyyy-MM-dd, yyyy-MM-dd
Rules.dateRange = (value, {validValue}) => {
    // const strict 是否为严格时间，如果为否仅验证格式不验证日期
    // TODO 需要支持更多
    let range;
    if (typeof value === 'string') {
        range = value.split(',')
    } else if (Array.isArray(value)) {
        range = Array.from(value)
    } else {
        return false
    }
    if (range.length !== 2) return false
    return Rules.date(range[0], {validValue}) && Rules.date(range[1], {validValue})
}
// 需要为时间日期范围 yyyy-MM-dd hh:mm:ss, yyyy-MM-dd hh:mm:ss
Rules.datetimeRange = (value, {validValue}) => {
    // const strict 是否为严格时间，如果为否仅验证格式不验证日期
    let range;
    if (typeof value === 'string') {
        range = value.split(',')
    } else if (Array.isArray(value)) {
        range = Array.from(value)
    } else {
        return false
    }
    if (range.length !== 2) return false
    return Rules.datetime(range[0], {validValue}) && Rules.datetime(range[1], {validValue})
}

// 需要为 ISO8601 时间格式
// 如果 strict = true，那么诸如 2009-02-29 不存在的日期将会无效
Rules.iso8601 = value => isString(value) && isISO8601(value, {strict: true, strictSeparator: true})

// // 需要为小数，例如：0.1， .3， 1.1， 1.00003， 4.0
// Rules.decimal = value => {
//     value = String(value);
//     return isDecimal(value);
// }

// 需要为手机号
// 第二个参数为 {String | Array<locale>} locale
Rules.mobile = (value, {validValue}) => isStringOrNumber(value) && isMobilePhone(String(value), validValue && typeof validValue === 'string' ? validValue : 'zh-CN')

// 需要为 email 格式, options 参见 https://github.com/chriso/validator.js
Rules.email = (value, {validValue}) => {
    assert(isObject(validValue) || validValue === true, 'email\'s value should be object or true')
    return isString(value) && isEmail(value, validValue === true ? undefined : validValue)
}

// 需要为 int 型
Rules.int = (value, {validValue}) => {
    assert(isObject(validValue) || validValue === true, 'int\'s value should be object or true');
    return isStringOrNumber(value) && isInt(String(value), typeof validValue === 'object' ? validValue : undefined)
}

//需要为浮点数
Rules.float = (value, {validValue}) => {
    assert(isObject(validValue) || validValue === true, 'float\'s value should be object or true')
    value = String(value)
    if (!isFloat(value)) return false
    if (isObject(validValue)) {
        if (!isFloat(value, validValue)) return 'range'
        if (validValue.decimal) {
            assert(isNumber(validValue.decimal), 'float.decimal should be number')
            const decimal = `${value}`.split('.')[1]
            if (decimal && decimal.length > validValue.decimal) return 'decimal'
        }
    }
    return true
}

// // Rules.multiple = (value, {argName, validValue}) => {
// //     if (value && typeof validValue === 'number') {
// //         try {
// //             if (big(value).mod(validValue).toString() === '0') {
// //                 return true
// //             }
// //         } catch (e) {}
// //     }
// //     return false
// // }


// 需要为个十六进制颜色值
Rules.hexColor = value => isString(value) && isHexColor(value)
// 需要为个十六进制颜色值
Rules.rgbColor = value => isString(value) && isRgbColor(value)

// 需要为十六进制
Rules.hex = value => isString(value) && isHexadecimal(value)

// 需要为 ip 格式
Rules.ip = (value, {validValue}) => {
    const version = validValue == 4 || validValue == 6 ? Number(validValue) : undefined
    return isString(value) && isIP(value, version)
}

// 需要为 ip4 格式
Rules.ip4 = value => isString(value) && isIP(value, 4)

// 需要为 ip6 格式
Rules.ip6 = value => isString(value) && isIP(value, 6)

// 需要为 UUID（1, 2, 3，4，5 版本)
Rules.uuid = (value, {validValue}) => {
    const version = validValue == 1 || validValue == 2 || validValue == 3 || validValue == 4 || validValue == 5 ? Number(validValue) : undefined
    return isString(value) && isUUID(value, version)
}

// 需要为 md5
Rules.md5 = value => isString(value) && isHash(value, 'md5')

// 需要为 sha256
Rules.sha256 = value => isString(value) && isHash(value, 'sha256')

// 需要为 hash 值
Rules.hash = (value, {validValue}) => {
    assert(!!~["md4", "md5", "sha1", "sha256", "sha384", "sha512", "ripemd128", "ripemd160", "tiger128", "tiger160", "tiger192", "crc32", "crc32b"].indexOf(validValue), 'hash value should like "md5"、"sha256"、"sha512"...')
    return isString(value) && isHash(value, validValue)
}

// 需要为 mimeType 类型
// 参见 https://en.wikipedia.org/wiki/Media_type
// 诸如 image/* 是不符合验证规则的
Rules.mimeType = value => isString(value) && isMimeType(value)

// 在某些值中
Rules.in = (value, {validValue}) => {
    assert(isArray(validValue), 'in\'s value should be array')
    if (Object.prototype.toString.call(validValue) === '[object Array]') {
        // const array = []
        // for (let i in validValue) {
        //     if (Object.prototype.hasOwnProperty.call(validValue, i)) {
        //         array[i] = String(validValue[i])
        //     }
        // }
        // return array.indexOf(value) >= 0
        return validValue.indexOf(value) >= 0
    } else if (typeof options === 'object') {
        return Object.prototype.hasOwnProperty.call(validValue, value)
    } else if (validValue && typeof validValue.indexOf === 'function') {
        return validValue.indexOf(value) >= 0
    }
    return false
}

// 不能在某些值中
Rules.notIn = (value, {validValue}) => {
    assert(isArray(validValue), 'notIn\'s value should be array')
    return !Rules.in(value, {validValue})
}

// 从属于某些值中
Rules.checkbox = (value, {validValue}) => {
    assert(isArray(validValue), 'validValue\'s value should be array')
    if (!isArray(value)) return Rules.in(value, {validValue})
    const map = {}
    let isRepeat = false
    const flag = value.every(item => {
        const valid = !!validValue.find(row => row === item)
        if (valid && map[item]) {
            isRepeat = true
            return false
        }
        map[item] = true
        return valid
    })
    return isRepeat ? 'repeat' : flag
}

// 长度需要在某个范围
Rules.length = (value, {validValue, rule}) => {
    if (rule.array) {
        return Rules.array(value, {validValue}) // 除了数组使用长度进行验证，其他当成字符串来处理
    } else {
        assert(isObject(validValue) || helper.isInt(validValue), 'length\'s value should be object or integer')
        if (isObject(validValue)) {
            return isLength(String(value), {min: validValue.min | 0, max: validValue.max})
        } else {
            assert(validValue > 0, 'length\'s value should be integer larger than zero')
            return isLength(String(value), {min: validValue, max: validValue})
        }
    }
}

// 需要都是小写字母
Rules.lowercase = value => isString(value) && value === value.toLowerCase()

// 需要都是大写字母
Rules.uppercase = value => isString(value) && value === value.toUpperCase()

// 需要为 MongoDB 的 ObjectID
Rules.mongoId = value => isString(value) && isMongoId(value)

// 需要为数据库查询 order, 如 'id ASC'  'name DESC' 或 'id ASC, name DESC'
Rules.sqlOrder = value => isString(value) && value.split(/\s*,\s*/).every(item => /^\w+\s+(?:ASC|DESC)$/i.test(item))

// 需要为数据库查询的字段
Rules.sqlField = value => isString(value) && value.split(/\s*,\s*/).every(item => item === '*' || /^\w+$/.test(item))

// 需要以某些字符打头
Rules.startWith = (value, {validValue}) => isString(value) && value.indexOf(validValue) === 0

// 需要以某些字符结束
Rules.endWith = (value, {validValue}) => isString(value) && value.lastIndexOf(validValue) === value.length - validValue.length

// 需要为字符串
Rules.string = (value, {validValue, rule}) => {
    assert(isObject(validValue) || helper.isInt(validValue) || validValue === true, 'string\'s value should be object, integer or true')
    if (!isString(value)) return false
    if (validValue !== true && Rules.length(value, {validValue, rule}) !== true) return 'length'
    return true
}


// 需要为布尔类型
// 以下集合都能符合判定 [true, 'true', 'True', 'TRUE', 1, '1'], [false, 'false', 'False', 'FALSE', 0, '0']
// 若需要更精准的匹配推荐使用 Rules.in 验证
Rules.boolean = value => isBoolean(String(value))

// 字段值要匹配给出的正则
Rules.regexp = (value, {validValue}) => {
    assert(isRegExp(validValue), 'argument should be regexp')
    return validValue.test(value)
}

// 需要为数组
Rules.array = (value, {validValue}) => {
    assert(isObject(validValue) || validValue === true, 'array\'s value should be object or true')
    if (!isArray(value)) return false
    if (validValue && typeof validValue === 'object') {
        if (typeof validValue.min === 'number' && validValue.min > value.length) return 'range'
        if (typeof validValue.max === 'number' && validValue.max < value.length) return 'range'
        if (typeof validValue.lt === 'number' && validValue.lt <= value.length) return 'range'
        if (typeof validValue.gt === 'number' && validValue.gt >= value.length) return 'range'
    }
    return true
}

// 需要为对象
Rules.object = value => isObject(value)

export {
    Rules
}