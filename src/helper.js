function assert(judge, msg) {
    if (!judge) throw new Error(msg)
}

function extend(target = {}, ...args) {
    const length = args.length
    let options, name, src, copy;
    if (!target) {
        target = isArray(args[0]) ? [] : {}
    }
    for (let i = 0; i < length; i++) {
        options = args[i]
        if (!options) {
            continue
        }
        for (name in options) {
            src = target[name]
            copy = options[name]
            if (src && src === copy) {
                continue
            }
            if (isArray(copy)) {
                target[name] = extend([], copy)
            } else if (isObject(copy)) {
                target[name] = extend(src && isObject(src) ? src : {}, copy)
            } else {
                target[name] = copy
            }
        }
    }
    return target
}

function toString(input) {
    if  (typeof input === 'function') {
        if (typeof input.toString === 'function') {
            input = input.toString()
        } else {
            input = '[object Function]'
        }
    } else if (typeof input === 'object' && input !== null) {
        if (typeof input.toString === 'function') {
            input = input.toString()
        } else {
            input = '[object Object]'
        }
    } else if (input === null || typeof input === 'undefined' || isNaN(input) && !input.length) {
        input = ''
    }
    return String(input)
}

function getProperty(obj, path) {
    if (!obj) return
    if (typeof path === 'number') path = String(path)
    if (typeof path !== 'string' || path === '') return ''
    const nodes = path.split('.')
    let tunnel = obj
    while (nodes.length > 0) {
        const node = nodes.shift()
        if (typeof tunnel === 'object' && tunnel !== null && Object.prototype.hasOwnProperty.call(tunnel, node)) {
            if (nodes.length === 0) {
                return tunnel[node]
            } else {
                tunnel = tunnel[node]
            }
        } else {
            return undefined
        }
    }
    return undefined
}

function isTrueEmpty(obj) {
    return !!(obj === undefined || obj === '' || Number.isNaN(obj)) // null 在 mysql 等数据库中有意义，所以不能算无效值
}

function isFunction(obj) {
    return typeof obj === 'function'
}

function isArray(obj) {
    if (Array.isArray) return Array.isArray(obj)
    return Object.prototype.toString.call(obj) === '[object Array]'
}

function isString(obj) {
    return typeof obj === 'string'
}
function isNumber(obj) {
    return typeof obj === 'number'
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

function isBoolean(obj) {
    return typeof obj === 'boolean'
}

function isInt(obj) {
    if (Number.isInteger) return Number.isInteger(obj)
    return (obj | 0) === obj
}

function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]'
}

export {
    assert,
    extend,
    toString,
    getProperty,
    isTrueEmpty,
    isFunction,
    isArray,
    isString,
    isNumber,
    isObject,
    isBoolean,
    isInt,
    isRegExp
}