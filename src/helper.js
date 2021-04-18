

module.exports = {

    assert(judge, msg) {
        if (!judge) throw new Error(msg)
    },
    extend(target = {}, ...args) {
        let i = 0;
        const length = args.length;
        let options;
        let name;
        let src;
        let copy;
        if (!target) {
            target = this.isArray(args[0]) ? [] : {};
        }
        for (; i < length; i++) {
            options = args[i];
            if (!options) {
                continue;
            }
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (src && src === copy) {
                    continue;
                }
                if (this.isArray(copy)) {
                    target[name] = this.extend([], copy);
                } else if (this.isObject(copy)) {
                    target[name] = this.extend(src && this.isObject(src) ? src : {}, copy);
                } else {
                    target[name] = copy;
                }
            }
        }
        return target
    },

    isTrueEmpty(obj) {
        return !!(obj === undefined || obj === null || obj === '' || Number.isNaN(obj))
    },
    isFunction(obj) {
        return typeof obj === 'function'
    },
    isArray(obj) {
        return Array.isArray(obj)
    },
    isString(obj) {
        return typeof obj === 'string'
    },
    isObject(obj, strict = true) {
        if (obj && typeof obj === 'object') {
            if (strict && Object.prototype.toString.call(obj) !== "[object Object]") {
                return false // 严格模式下只有 {} 的对象可以返回 true
            }
            return true // [] 等也会返回 true
        }
        return false
    },
    isBoolean(obj) {
        return typeof obj === 'boolean'
    },
    isInt(obj, strict = true) {
        if (obj % 1 === 0) {
            if (strict && typeof obj !== 'number') {
                return false // 123 or 123.00 都会返回 true
            }
            return true // 123 or '123' or 123.00 or '123.00' 都会返回 true
        }
        return typeof obj === 'number' && obj % 1 === 0
    },
    isRegExp(obj) {
        console.log(obj, Object.prototype.toString.call(obj))
        return Object.prototype.toString.call(obj) === '[object RegExp]'
    }
}