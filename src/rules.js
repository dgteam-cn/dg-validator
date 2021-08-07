const validator = require('validator')
const METHOD_MAP = require('./method.js')
const helper = require('./helper.js')
const {assert} = helper

// const dataCheker = function(value) {
//     let format = value.split('-')
//     if (format.length !== 3) {
//         return false
//     }
//     for (let i=0;i<format.length;i++) {
//         let date = format[i]
//         if (!/^\d*$/.test(date)) {
//             return false
//         } else if (i===0) {
//             if (date.length !== 4) {
//                 return false
//             }
//             if (parseInt(date) < 2000 || parseInt(date) > 3000) {
//                 return false
//             }
//         } else if (i===1) {
//             if (date.length !== 2) {
//                 return false
//             }
//             if (parseInt(date) < 1 || parseInt(date) > 12) {
//                 return false
//             }
//         } else if (i===2) {
//             if (date.length !== 2) {
//                 return false
//             }
//             if (parseInt(date) < 1 || parseInt(date) > 31) {
//                 return false
//             }
//         }
//     }
//     return true
// }

const Rules = {}

Rules.required = (value, validValue) => {
    return validValue
}
Rules._requiredIf = (validValue, {currentQuery, ctx, rules}) => {
    assert(helper.isArray(validValue), 'requiredIf\'s value should be array')
    validValue = validValue.slice()
    const first = validValue[0]
    if (rules && rules[first] && rules[first]['method']) {
        currentQuery = helper.extend({}, currentQuery)
        const method = rules[first]['method'].toUpperCase()
        currentQuery = ctx[METHOD_MAP[method]]()
    }
    validValue[0] = currentQuery[first]
    return validValue
}
Rules.requiredIf = (value, {parsedValidValue}) => {
    const first = parsedValidValue[0]
    const others = parsedValidValue.slice(1)
    return others.indexOf(first) > -1
}
Rules._requiredNotIf = (validValue, {currentQuery, ctx, rules}) => {
    assert(helper.isArray(validValue), 'requiredNotIf\'s value should be array')
    return Rules._requiredIf(validValue, {currentQuery, ctx, rules})
}
Rules.requiredNotIf = (value, {parsedValidValue}) => {
    const first = parsedValidValue[0]
    const others = parsedValidValue.slice(1)
    return others.indexOf(first) === -1
}
Rules._requiredWith = (validValue, {currentQuery, rules, ctx}) => {
    assert(helper.isArray(validValue), 'requiredWith\'s value should be array')
    validValue = validValue.slice()
    return validValue.map(item => {
        if (rules && rules[item] && rules[item]['method']) {
            currentQuery = helper.extend({}, currentQuery)
            const method = rules[item]['method'].toUpperCase()
            currentQuery = ctx[METHOD_MAP[method]]()
        }
        return !helper.isTrueEmpty(currentQuery[item]) ? currentQuery[item] : ''
    })
}
Rules.requiredWith = (value, {parsedValidValue}) => {
    return parsedValidValue.some(item => {
        return !helper.isTrueEmpty(item)
    })
}
Rules._requiredWithAll = (validValue, {currentQuery, rules, ctx}) => {
    assert(helper.isArray(validValue), 'requiredWithAll\'s value should be array')
    return Rules._requiredWith(validValue, {currentQuery, rules, ctx})
}
Rules.requiredWithAll = (value, {parsedValidValue}) => {
    return parsedValidValue.every(item => {
        return !helper.isTrueEmpty(item)
    })
}
Rules._requiredWithOut = (validValue, {currentQuery, rules, ctx}) => {
    assert(helper.isArray(validValue), 'requiredWithOut\'s value should be array')
    return Rules._requiredWith(validValue, {currentQuery, rules, ctx})
}
Rules.requiredWithOut = (value, {parsedValidValue}) => {
    return parsedValidValue.some(item => {
        return helper.isTrueEmpty(item)
    })
}
Rules._requiredWithOutAll = (validValue, {currentQuery, rules, ctx}) => {
    assert(helper.isArray(validValue), 'requiredWithOutAll\'s value should be array')
    return Rules._requiredWith(validValue, {currentQuery, rules, ctx})
}
Rules.requiredWithOutAll = (value, {parsedValidValue}) => {
    return parsedValidValue.every(item => {
        return helper.isTrueEmpty(item);
    })
}

// 值必须包含某个特性的对象，类似 indexOf
Rules.contains = (value, {validValue}) => {
    value = validator.toString(value)
    return validator.contains(value, validValue)
}
// // 值必须和另外一个值相等
// Rules._equals = (validValue, {currentQuery, rules, ctx}) => {
//     if (rules && rules[validValue] && rules[validValue]['method']) {
//         currentQuery = helper.extend({}, currentQuery)
//         const method = rules[validValue]['method'].toUpperCase()
//         currentQuery = ctx[METHOD_MAP[method]]()
//     }
//     return currentQuery[validValue]
// }
// Rules.equals = (value, {parsedValidValue}) => {
//     value = validator.toString(value)
//     return validator.equals(value, parsedValidValue)
// }
// Rules._different = (validValue, {currentQuery, rules, ctx}) => {
//     return Rules._equals(validValue, {currentQuery, rules, ctx})
// }
// // 和另一项的值不等
// Rules.different = (value, {parsedValidValue}) => {
//     value = validator.toString(value)
//     return !validator.equals(value, parsedValidValue)
// }

// // 值需要在一个日期之前，默认为需要在当前日期之前
// Rules._before = (validValue) => {
//     if (validValue === true) {
//         const now = new Date()
//         const nowTime = now.getFullYear() + '-' +
//                     (now.getMonth() + 1) + '-' +
//                     now.getDate() + ' ' +
//                     now.getHours() + ':' +
//                     now.getMinutes() + ':' +
//                     now.getSeconds();
//         return nowTime
//     }
//     assert(Rules.date(validValue), 'validValue should be date')
//     return validValue
// }
// Rules.before = (value, {parsedValidValue}) => {
//     value = validator.toString(value)
//     return validator.isBefore(value, parsedValidValue)
// }

// // 值需要在一个日期之后，默认为需要在当前日期之后
// Rules._after = (validValue) => {
//     return Rules._before(validValue)
// }
// Rules.after = (value, {parsedValidValue}) => {
//     value = validator.toString(value)
//     return validator.isAfter(value, parsedValidValue)
// }

// 值只能是 [a-zA-Z] 组成
Rules.alpha = value => {
    value = validator.toString(value)
    return validator.isAlpha(value)
}

// 值只能是 [a-zA-Z_] 组成
Rules.alphaDash = value => {
    value = validator.toString(value)
    return /^[A-Z_]+$/i.test(value)
}

// 值只能是 [a-zA-Z0-9] 组成
Rules.alphaNumeric = value => {
    value = validator.toString(value)
    return validator.isAlphanumeric(value)
}

// 值只能是 [a-zA-Z0-9_] 组成
Rules.alphaNumericDash = value => {
    value = validator.toString(value)
    return /^\w+$/i.test(value)
}

// 值只能是 ascii 字符组成
Rules.ascii = value => {
    value = validator.toString(value)
    return validator.isAscii(value)
}

// 值必须是 base64 编码
Rules.base64 = value => {
    value = validator.toString(value)
    return validator.isBase64(value)
}

// // 字节长度需要在一个区间内,
// Rules.byteLength = (value, {validValue}) => {
//     assert(helper.isObject(validValue) || helper.isInt(validValue), 'byteLength\'s value should be object or integer')
//     value = validator.toString(value)
//     if (helper.isObject(validValue)) {
//         return validator.isByteLength(value, {min: validValue.min | 0, max: validValue.max})
//     } else {
//         assert(value > 0, 'byteLength\'s value should be integer larger than zero')
//         return validator.isByteLength(value, {min: validValue, max: validValue})
//     }
// }

// 需要为信用卡数字
Rules.creditCard = value => {
    value = validator.toString(value)
    return validator.isCreditCard(value)
}

// 需要为货币, options 参见 https://github.com/chriso/validator.js
Rules.currency = (value, {validValue}) => {
    assert(helper.isObject(validValue) || validValue === true, 'currency\'s value should be object or true');
    value = validator.toString(value);
    if (validValue === true) {
        return validator.isCurrency(value);
    } else {
        return validator.isCurrency(value, validValue);
    }
}

// 需要为日期 yyyy-MM-dd
function isValidDateString(str) {
    if (typeof str !== 'string') return false
    str = str.replace(/-/g,'/') // 为了兼容苹果系统把日期的 "-" 换成 "/"
    return new Date(str).getDate() == date.split(' ')[0].substring(8) // 如果日期时间的 day 与文本时间的 day 相同表示该日期有效
}
Rules.date = (value, {validValue}) => {
    // const strict = typeof validValue === 'object' ? Boolean(strict) : false // 是否为严格时间，如果为否仅验证格式不验证日期
    // const min // 最小日期，会自动序列化，输入日期必须比该时间大
    // const max // 最大日期，会自动序列化，输入日期必须比该时间小
    // return dataCheker(value) // !isNaN(Date.parse(value))
    const flag = /^[1-3]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value)
    if (!flag) return false
    // if (strict && !isValidDateString(value)) return false
    return true
}
// 需要为时间 hh:mm:ss
Rules.time = (value, {validValue}) => {
    // const min // or 'start' 最小时间，输入时间总秒数必须比该时间大
    // const max // or 'end' 最大时间，输入时间总秒数必须比该时间小
    // const step // 步进值（意义不大），所选时间必须是步进值的倍数
    // const format // 时间格式：12小时制 或 24小时制（默认）
    const flag = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(value)
    if (!flag) return false
    return true
}
// 需要为日期时间 yyyy-MM-dd hh:mm:ss
Rules.datetime = (value, {validValue}) => {
    // const strict 是否为严格时间，如果为否仅验证格式不验证日期
    // const format // 时间格式：12小时制 或 24小时制（默认）
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

// 需要为小数，例如：0.1， .3， 1.1， 1.00003， 4.0
Rules.decimal = value => {
    value = validator.toString(value);
    return validator.isDecimal(value);
}

// 需要被一个数整除
Rules.divisibleBy = (value, {validValue}) => {
    value = validator.toString(value);
    return validator.isDivisibleBy(value, validValue);
}

// 需要为 email 格式, options 参见 https://github.com/chriso/validator.js
Rules.email = (value, {validValue}) => {
    assert(helper.isObject(validValue) || validValue === true, 'email\'s value should be object or true');
    value = validator.toString(value)
    if (validValue === true) {
        return validator.isEmail(value)
    } else {
        return validator.isEmail(value, validValue)
    }
}

// 需要为合格的域名, options 参见 https://github.com/chriso/validator.js
Rules.fqdn = (value, {validValue}) => {
    assert(helper.isObject(validValue) || validValue === true, 'fqdn\'s value should be object or true');
    value = validator.toString(value);
    if (validValue === true) {
        return validator.isFQDN(value);
    } else {
        return validator.isFQDN(value, validValue);
    }
}

//需要为浮点数
Rules.float = (value, {argName, validValue}) => {
    assert(helper.isObject(validValue) || validValue === true, 'float\'s value should be object or true')
    value = validator.toString(value)
    if (validValue === true) {
        return validator.isFloat(value)
    } else {
        const flag = validator.isFloat(value, validValue)
        if (flag) {
            const {decimal} = validValue
            const dec = `${value}`.split('.')
            if (decimal && dec[1] && dec[1].length > decimal) {
                return {[argName]: `最多支持 ${decimal} 位小数`}
            }
        }
        return flag
    }
}

// 需要包含宽字节字符
Rules.fullWidth = value => {
    value = validator.toString(value)
    return validator.isFullWidth(value)
}

// 需要包含半字节字符
Rules.halfWidth = value => {
    value = validator.toString(value)
    return validator.isHalfWidth(value)
}

// 需要为个十六进制颜色值
Rules.hexColor = value => {
    value = validator.toString(value)
    return validator.isHexColor(value)
}

// 需要为十六进制
Rules.hex = value => {
    value = validator.toString(value)
    return validator.isHexadecimal(value)
}

// 需要为 ip 格式
Rules.ip = value => {
    value = validator.toString(value)
    return validator.isIP(value, 4) || validator.isIP(value, 6)
}

// 需要为 ip4 格式
Rules.ip4 = value => {
    value = validator.toString(value)
    return validator.isIP(value, 4)
}

// 需要为 ip6 格式
Rules.ip6 = value => {
    value = validator.toString(value)
    return validator.isIP(value, 6)
}

// // 需要为国际标准书号
// Rules.isbn = value => {
//     value = validator.toString(value)
//     return validator.isISBN(value, 10) || validator.isISBN(value, 13)
// }

// Rules.isin = value => {
//     value = validator.toString(value)
//     return validator.isISIN(value)
// }

// // 需要为证券识别编码
// Rules.iso8601 = value => {
//     value = validator.toString(value)
//     return validator.isISO8601(value)
// }

// 国际标准连续出版物编号
Rules.issn = (value, {validValue}) => {
    assert(helper.isObject(validValue) || validValue === true, 'issn\'s validValue should be object or true')
    value = validator.toString(value)
    if (validValue === true) {
        return validator.isISSN(value)
    } else {
        return validator.isISSN(value, validValue)
    }
}

// 需要为 UUID（3，4，5 版本)
Rules.uuid = value => {
    value = validator.toString(value)
    return validator.isUUID(value, 3) || validator.isUUID(value, 4) || validator.isUUID(value, 5)
}

// 需要为 dataURI 格式
Rules.dataURI = value => {
    value = validator.toString(value)
    return validator.isDataURI(value)
}

// 需要为 md5
Rules.md5 = value => {
    value = validator.toString(value)
    return validator.isMD5(value)
}

// // 需要为 mac 地址
// Rules.macAddress = value => {
//     value = validator.toString(value)
//     return validator.isMACAddress(value)
// }

// // 需要同时包含半字节和全字节字符
// Rules.variableWidth = value => {
//     value = validator.toString(value)
//     return validator.isVariableWidth(value)
// }

// 在某些值中
Rules.in = (value, {validValue}) => {
    assert(helper.isArray(validValue), 'in\'s value should be array')
    value = validator.toString(value)
    return validator.isIn(value, validValue)
}

// 不能在某些值中
Rules.notIn = (value, {validValue}) => {
    assert(helper.isArray(validValue), 'notIn\'s value should be array')
    value = validator.toString(value)
    return !validator.isIn(value, validValue)
}

// 需要为 int 型
Rules.int = (value, {validValue}) => {
    assert(helper.isObject(validValue) || validValue === true, 'int\'s value should be object or true');
    value = validator.toString(value)
    if (!validator.isInt(value)) return false
    if (typeof validValue === "object") {
        if (typeof validValue.min === 'number' && validValue.min > value) return 'range'
        if (typeof validValue.max === 'number' && validValue.max < value) return 'range'
        if (typeof validValue.lt === 'number' && validValue.lt <= value) return 'range'
        if (typeof validValue.gt === 'number' && validValue.gt >= value) return 'range'
    }
    // if (validValue === true) {
    //     return validator.isInt(value)
    // } else {
    //     return validator.isInt(value, validValue)
    // }
}

// 长度需要在某个范围
Rules.length = (value, {validValue, rule}) => {
    assert(helper.isObject(validValue) || helper.isInt(validValue), 'length\'s value should be object or integer')
    // if (rule.array) {
    //     try {
    //         const sample = helper.isArray(value) ? value : JSON.parse(value)
            
    //     } catch (err) {
    //         return true
    //     }
    //     if (helper.isArray(value))
    // } else if (rule.object) {

    // } else {
    //     value = validator.toString(value)
    //     if (helper.isObject(validValue)) {
    //         return validator.isLength(value, {min: validValue.min | 0, max: validValue.max})
    //     } else {
    //         assert(validValue > 0, 'length\'s value should be integer larger than zero')
    //         return validator.isLength(value, {min: validValue, max: validValue})
    //     }
    // }

    value = validator.toString(value)
    if (helper.isObject(validValue)) {
        return validator.isLength(value, {min: validValue.min | 0, max: validValue.max})
    } else {
        assert(validValue > 0, 'length\'s value should be integer larger than zero')
        return validator.isLength(value, {min: validValue, max: validValue})
    }
}

// 需要都是小写字母
Rules.lowercase = value => {
    value = validator.toString(value)
    return validator.isLowercase(value)
}
// Rules.lower = value => Rules.lowercase(value)

// 需要都是大写字母
Rules.uppercase = value => {
    value = validator.toString(value)
    return validator.isUppercase(value)
}
// Rules.upper = value => Rules.uppercase(value)

// 需要为手机号
Rules.mobile = (value, {validValue}) => {
    value = validator.toString(value)
    if (validValue === true) {
        return validator.isMobilePhone(value, 'zh-CN')
    } else {
        return validator.isMobilePhone(value, validValue)
    }
}

// 需要为 MongoDB 的 ObjectID
Rules.mongoId = value => {
    value = validator.toString(value)
    return validator.isMongoId(value)
}

// 需要包含多字节字符
Rules.multibyte = value => {
    value = validator.toString(value)
    return validator.isMultibyte(value)
}

// 需要为 url
Rules.url = (value, {validValue}) => {
    assert(helper.isObject(validValue) || validValue === true, 'url\'s validValue should be object or true')
    value = validator.toString(value)
    if (validValue === true) {
        return validator.isURL(value)
    } else {
        return validator.isURL(value, validValue)
    }
}

// 需要为数据库查询 order, 如：id ASC 、 name DESC
Rules.order = value => {
    return value.split(/\s*,\s*/).every(item => {
        return /^\w+\s+(?:ASC|DESC)$/i.test(item)
    })
}

// 需要为数据库查询的字段
Rules.field = value => {
    return value.split(/\s*,\s*/).every(item => {
        return item === '*' || /^\w+$/.test(item)
    })
}

// //上传的文件需要为图片
// Rules.image = value => {
//     if (helper.isObject(value)) {
//         value = value.name
//     }
//     return /\.(?:jpeg|jpg|png|bmp|gif|svg)$/i.test(value)
// }

// 需要以某些字符打头
Rules.startWith = (value, {validValue}) => {
    return value.indexOf(validValue) === 0
}

// 需要以某些字符结束
Rules.endWith = (value, {validValue}) => {
    return value.lastIndexOf(validValue) === value.length - validValue.length
}

// 需要为字符串
Rules.string = value => {
    return helper.isString(value)
}

// 需要为数组
Rules.array = (value, {argName, validValue}) => {
    let isArray = helper.isArray(value)
    if (!isArray && value !== null) {
        return false
    }
    if (validValue && typeof validValue === 'object') {
        let {min, max} = validValue
        if (min && value.length < min) {
            return {[argName]: `数组长度不能小于 ${min}`}
        }
        if (max && value.length > max) {
            return {[argName]: `数组长度不能大于 ${max}`}
        }
    }
    return
}

// 需要为布尔类型
Rules.bool = value => {
    return helper.isBoolean(value)
}
Rules.boolean = value => Rules.bool(value)

// 需要为对象
Rules.object = value => {
    return helper.isObject(value)
}

// 字段值要匹配给出的正则
Rules.regexp = (value, {validValue}) => {
    assert(helper.isRegExp(validValue), 'argument should be regexp')
    return validValue.test(value)
}

module.exports = Rules