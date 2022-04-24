/*!
 * test mode
 * @license MIT
 */
function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var contains = {exports: {}};

var assertString = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertString;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function assertString(input) {
  var isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    var invalidType = _typeof(input);

    if (input === null) { invalidType = 'null'; }else if (invalidType === 'object') { invalidType = input.constructor.name; }
    throw new TypeError("Expected a string but received a ".concat(invalidType));
  }
}

module.exports = exports.default;
module.exports.default = exports.default;
}(assertString, assertString.exports));

var toString = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toString;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function toString(input) {
  if (_typeof(input) === 'object' && input !== null) {
    if (typeof input.toString === 'function') {
      input = input.toString();
    } else {
      input = '[object Object]';
    }
  } else if (input === null || typeof input === 'undefined' || isNaN(input) && !input.length) {
    input = '';
  }

  return String(input);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(toString, toString.exports));

var merge = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = merge;

function merge() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = arguments.length > 1 ? arguments[1] : undefined;

  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }

  return obj;
}

module.exports = exports.default;
module.exports.default = exports.default;
}(merge, merge.exports));

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contains;

var _assertString = _interopRequireDefault(assertString.exports);

var _toString = _interopRequireDefault(toString.exports);

var _merge = _interopRequireDefault(merge.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaulContainsOptions = {
  ignoreCase: false,
  minOccurrences: 1
};

function contains(str, elem, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, defaulContainsOptions);

  if (options.ignoreCase) {
    return str.toLowerCase().split((0, _toString.default)(elem).toLowerCase()).length > options.minOccurrences;
  }

  return str.split((0, _toString.default)(elem)).length > options.minOccurrences;
}

module.exports = exports.default;
module.exports.default = exports.default;
}(contains, contains.exports));

var isContains = /*@__PURE__*/getDefaultExportFromCjs(contains.exports);

var isBase64$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBase64;

var _assertString = _interopRequireDefault(assertString.exports);

var _merge = _interopRequireDefault(merge.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notBase64 = /[^A-Z0-9+\/=]/i;
var urlSafeBase64 = /^[A-Z0-9_\-]*$/i;
var defaultBase64Options = {
  urlSafe: false
};

function isBase64(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, defaultBase64Options);
  var len = str.length;

  if (options.urlSafe) {
    return urlSafeBase64.test(str);
  }

  if (len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  var firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isBase64$1, isBase64$1.exports));

var isBase64 = /*@__PURE__*/getDefaultExportFromCjs(isBase64$1.exports);

var isCreditCard$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCreditCard;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3,6})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12,15}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|6[27][0-9]{14}|^(81[0-9]{14,17}))$/;
/* eslint-enable max-len */

function isCreditCard(str) {
  (0, _assertString.default)(str);
  var sanitized = str.replace(/[- ]+/g, '');

  if (!creditCard.test(sanitized)) {
    return false;
  }

  var sum = 0;
  var digit;
  var tmpNum;
  var shouldDouble;

  for (var i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);

    if (shouldDouble) {
      tmpNum *= 2;

      if (tmpNum >= 10) {
        sum += tmpNum % 10 + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }

    shouldDouble = !shouldDouble;
  }

  return !!(sum % 10 === 0 ? sanitized : false);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isCreditCard$1, isCreditCard$1.exports));

var isCreditCard = /*@__PURE__*/getDefaultExportFromCjs(isCreditCard$1.exports);

var isMobilePhone$1 = {};

Object.defineProperty(isMobilePhone$1, "__esModule", {
  value: true
});
var _default$1 = isMobilePhone$1.default = isMobilePhone;
isMobilePhone$1.locales = void 0;

var _assertString$1 = _interopRequireDefault$1(assertString.exports);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var phones = {
  'am-AM': /^(\+?374|0)((10|[9|7][0-9])\d{6}$|[2-4]\d{7}$)/,
  'ar-AE': /^((\+?971)|0)?5[024568]\d{7}$/,
  'ar-BH': /^(\+?973)?(3|6)\d{7}$/,
  'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
  'ar-LB': /^(\+?961)?((3|81)\d{6}|7\d{7})$/,
  'ar-EG': /^((\+?20)|0)?1[0125]\d{8}$/,
  'ar-IQ': /^(\+?964|0)?7[0-9]\d{8}$/,
  'ar-JO': /^(\+?962|0)?7[789]\d{7}$/,
  'ar-KW': /^(\+?965)[569]\d{7}$/,
  'ar-LY': /^((\+?218)|0)?(9[1-6]\d{7}|[1-8]\d{7,9})$/,
  'ar-MA': /^(?:(?:\+|00)212|0)[5-7]\d{8}$/,
  'ar-OM': /^((\+|00)968)?(9[1-9])\d{6}$/,
  'ar-PS': /^(\+?970|0)5[6|9](\d{7})$/,
  'ar-SA': /^(!?(\+?966)|0)?5\d{8}$/,
  'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
  'ar-TN': /^(\+?216)?[2459]\d{7}$/,
  'az-AZ': /^(\+994|0)(5[015]|7[07]|99)\d{7}$/,
  'bs-BA': /^((((\+|00)3876)|06))((([0-3]|[5-6])\d{6})|(4\d{7}))$/,
  'be-BY': /^(\+?375)?(24|25|29|33|44)\d{7}$/,
  'bg-BG': /^(\+?359|0)?8[789]\d{7}$/,
  'bn-BD': /^(\+?880|0)1[13456789][0-9]{8}$/,
  'ca-AD': /^(\+376)?[346]\d{5}$/,
  'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  'da-DK': /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'de-DE': /^((\+49|0)[1|3])([0|5][0-45-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7,9}$/,
  'de-AT': /^(\+43|0)\d{1,4}\d{3,12}$/,
  'de-CH': /^(\+41|0)([1-9])\d{1,9}$/,
  'de-LU': /^(\+352)?((6\d1)\d{6})$/,
  'dv-MV': /^(\+?960)?(7[2-9]|91|9[3-9])\d{7}$/,
  'el-GR': /^(\+?30|0)?(69\d{8})$/,
  'en-AU': /^(\+?61|0)4\d{8}$/,
  'en-BM': /^(\+?1)?441(((3|7)\d{6}$)|(5[0-3][0-9]\d{4}$)|(59\d{5}))/,
  'en-GB': /^(\+?44|0)7\d{9}$/,
  'en-GG': /^(\+?44|0)1481\d{6}$/,
  'en-GH': /^(\+233|0)(20|50|24|54|27|57|26|56|23|28|55|59)\d{7}$/,
  'en-GY': /^(\+592|0)6\d{6}$/,
  'en-HK': /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/,
  'en-MO': /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/,
  'en-IE': /^(\+?353|0)8[356789]\d{7}$/,
  'en-IN': /^(\+?91|0)?[6789]\d{9}$/,
  'en-KE': /^(\+?254|0)(7|1)\d{8}$/,
  'en-KI': /^((\+686|686)?)?( )?((6|7)(2|3|8)[0-9]{6})$/,
  'en-MT': /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/,
  'en-MU': /^(\+?230|0)?\d{8}$/,
  'en-NA': /^(\+?264|0)(6|8)\d{7}$/,
  'en-NG': /^(\+?234|0)?[789]\d{9}$/,
  'en-NZ': /^(\+?64|0)[28]\d{7,9}$/,
  'en-PK': /^((00|\+)?92|0)3[0-6]\d{8}$/,
  'en-PH': /^(09|\+639)\d{9}$/,
  'en-RW': /^(\+?250|0)?[7]\d{8}$/,
  'en-SG': /^(\+65)?[3689]\d{7}$/,
  'en-SL': /^(\+?232|0)\d{8}$/,
  'en-TZ': /^(\+?255|0)?[67]\d{8}$/,
  'en-UG': /^(\+?256|0)?[7]\d{8}$/,
  'en-US': /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  'en-ZA': /^(\+?27|0)\d{9}$/,
  'en-ZM': /^(\+?26)?09[567]\d{7}$/,
  'en-ZW': /^(\+263)[0-9]{9}$/,
  'en-BW': /^(\+?267)?(7[1-8]{1})\d{6}$/,
  'es-AR': /^\+?549(11|[2368]\d)\d{8}$/,
  'es-BO': /^(\+?591)?(6|7)\d{7}$/,
  'es-CO': /^(\+?57)?3(0(0|1|2|4|5)|1\d|2[0-4]|5(0|1))\d{7}$/,
  'es-CL': /^(\+?56|0)[2-9]\d{1}\d{7}$/,
  'es-CR': /^(\+506)?[2-8]\d{7}$/,
  'es-CU': /^(\+53|0053)?5\d{7}/,
  'es-DO': /^(\+?1)?8[024]9\d{7}$/,
  'es-HN': /^(\+?504)?[9|8]\d{7}$/,
  'es-EC': /^(\+?593|0)([2-7]|9[2-9])\d{7}$/,
  'es-ES': /^(\+?34)?[6|7]\d{8}$/,
  'es-PE': /^(\+?51)?9\d{8}$/,
  'es-MX': /^(\+?52)?(1|01)?\d{10,11}$/,
  'es-PA': /^(\+?507)\d{7,8}$/,
  'es-PY': /^(\+?595|0)9[9876]\d{7}$/,
  'es-SV': /^(\+?503)?[67]\d{7}$/,
  'es-UY': /^(\+598|0)9[1-9][\d]{6}$/,
  'es-VE': /^(\+?58)?(2|4)\d{9}$/,
  'et-EE': /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
  'fa-IR': /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
  'fi-FI': /^(\+?358|0)\s?(4(0|1|2|4|5|6)?|50)\s?(\d\s?){4,8}\d$/,
  'fj-FJ': /^(\+?679)?\s?\d{3}\s?\d{4}$/,
  'fo-FO': /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'fr-BF': /^(\+226|0)[67]\d{7}$/,
  'fr-CM': /^(\+?237)6[0-9]{8}$/,
  'fr-FR': /^(\+?33|0)[67]\d{8}$/,
  'fr-GF': /^(\+?594|0|00594)[67]\d{8}$/,
  'fr-GP': /^(\+?590|0|00590)[67]\d{8}$/,
  'fr-MQ': /^(\+?596|0|00596)[67]\d{8}$/,
  'fr-PF': /^(\+?689)?8[789]\d{6}$/,
  'fr-RE': /^(\+?262|0|00262)[67]\d{8}$/,
  'he-IL': /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/,
  'hu-HU': /^(\+?36|06)(20|30|31|50|70)\d{7}$/,
  'id-ID': /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
  'it-IT': /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
  'it-SM': /^((\+378)|(0549)|(\+390549)|(\+3780549))?6\d{5,9}$/,
  'ja-JP': /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/,
  'ka-GE': /^(\+?995)?(5|79)\d{7}$/,
  'kk-KZ': /^(\+?7|8)?7\d{9}$/,
  'kl-GL': /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'ko-KR': /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
  'lt-LT': /^(\+370|8)\d{8}$/,
  'lv-LV': /^(\+?371)2\d{7}$/,
  'ms-MY': /^(\+?6?01){1}(([0145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
  'mz-MZ': /^(\+?258)?8[234567]\d{7}$/,
  'nb-NO': /^(\+?47)?[49]\d{7}$/,
  'ne-NP': /^(\+?977)?9[78]\d{8}$/,
  'nl-BE': /^(\+?32|0)4\d{8}$/,
  'nl-NL': /^(((\+|00)?31\(0\))|((\+|00)?31)|0)6{1}\d{8}$/,
  'nn-NO': /^(\+?47)?[49]\d{7}$/,
  'pl-PL': /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
  'pt-BR': /^((\+?55\ ?[1-9]{2}\ ?)|(\+?55\ ?\([1-9]{2}\)\ ?)|(0[1-9]{2}\ ?)|(\([1-9]{2}\)\ ?)|([1-9]{2}\ ?))((\d{4}\-?\d{4})|(9[2-9]{1}\d{3}\-?\d{4}))$/,
  'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
  'pt-AO': /^(\+244)\d{9}$/,
  'ro-RO': /^(\+?4?0)\s?7\d{2}(\/|\s|\.|\-)?\d{3}(\s|\.|\-)?\d{3}$/,
  'ru-RU': /^(\+?7|8)?9\d{9}$/,
  'si-LK': /^(?:0|94|\+94)?(7(0|1|2|4|5|6|7|8)( |-)?)\d{7}$/,
  'sl-SI': /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/,
  'sk-SK': /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  'sq-AL': /^(\+355|0)6[789]\d{6}$/,
  'sr-RS': /^(\+3816|06)[- \d]{5,9}$/,
  'sv-SE': /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/,
  'tg-TJ': /^(\+?992)?[5][5]\d{7}$/,
  'th-TH': /^(\+66|66|0)\d{9}$/,
  'tr-TR': /^(\+?90|0)?5\d{9}$/,
  'tk-TM': /^(\+993|993|8)\d{8}$/,
  'uk-UA': /^(\+?38|8)?0\d{9}$/,
  'uz-UZ': /^(\+?998)?(6[125-79]|7[1-69]|88|9\d)\d{7}$/,
  'vi-VN': /^((\+?84)|0)((3([2-9]))|(5([25689]))|(7([0|6-9]))|(8([1-9]))|(9([0-9])))([0-9]{7})$/,
  'zh-CN': /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/,
  'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
  'dz-BT': /^(\+?975|0)?(17|16|77|02)\d{6}$/
};
/* eslint-enable max-len */
// aliases

phones['en-CA'] = phones['en-US'];
phones['fr-CA'] = phones['en-CA'];
phones['fr-BE'] = phones['nl-BE'];
phones['zh-HK'] = phones['en-HK'];
phones['zh-MO'] = phones['en-MO'];
phones['ga-IE'] = phones['en-IE'];
phones['fr-CH'] = phones['de-CH'];
phones['it-CH'] = phones['fr-CH'];

function isMobilePhone(str, locale, options) {
  (0, _assertString$1.default)(str);

  if (options && options.strictMode && !str.startsWith('+')) {
    return false;
  }

  if (Array.isArray(locale)) {
    return locale.some(function (key) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (phones.hasOwnProperty(key)) {
        var phone = phones[key];

        if (phone.test(str)) {
          return true;
        }
      }

      return false;
    });
  } else if (locale in phones) {
    return phones[locale].test(str); // alias falsey locale as 'any'
  } else if (!locale || locale === 'any') {
    for (var key in phones) {
      // istanbul ignore else
      if (phones.hasOwnProperty(key)) {
        var phone = phones[key];

        if (phone.test(str)) {
          return true;
        }
      }
    }

    return false;
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}

var locales$1 = Object.keys(phones);
isMobilePhone$1.locales = locales$1;

var isISO8601$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISO8601;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
// from http://goo.gl/0ejHHW
var iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/; // same as above, except with a strict 'T' separator between date and time

var iso8601StrictSeparator = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
/* eslint-enable max-len */

var isValidDate = function isValidDate(str) {
  // str must have passed the ISO8601 check
  // this check is meant to catch invalid dates
  // like 2009-02-31
  // first check for ordinal dates
  var ordinalMatch = str.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);

  if (ordinalMatch) {
    var oYear = Number(ordinalMatch[1]);
    var oDay = Number(ordinalMatch[2]); // if is leap year

    if (oYear % 4 === 0 && oYear % 100 !== 0 || oYear % 400 === 0) { return oDay <= 366; }
    return oDay <= 365;
  }

  var match = str.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number);
  var year = match[1];
  var month = match[2];
  var day = match[3];
  var monthString = month ? "0".concat(month).slice(-2) : month;
  var dayString = day ? "0".concat(day).slice(-2) : day; // create a date object and compare

  var d = new Date("".concat(year, "-").concat(monthString || '01', "-").concat(dayString || '01'));

  if (month && day) {
    return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month && d.getUTCDate() === day;
  }

  return true;
};

function isISO8601(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _assertString.default)(str);
  var check = options.strictSeparator ? iso8601StrictSeparator.test(str) : iso8601.test(str);
  if (check && options.strict) { return isValidDate(str); }
  return check;
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isISO8601$1, isISO8601$1.exports));

var isISO8601 = /*@__PURE__*/getDefaultExportFromCjs(isISO8601$1.exports);

var isEmail$1 = {exports: {}};

var isByteLength = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isByteLength;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable prefer-rest-params */
function isByteLength(str, options) {
  (0, _assertString.default)(str);
  var min;
  var max;

  if (_typeof(options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }

  var len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isByteLength, isByteLength.exports));

var isFQDN = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFQDN;

var _assertString = _interopRequireDefault(assertString.exports);

var _merge = _interopRequireDefault(merge.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_numeric_tld: false,
  allow_wildcard: false
};

function isFQDN(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_fqdn_options);
  /* Remove the optional trailing dot before checking validity */

  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }
  /* Remove the optional wildcard before checking validity */


  if (options.allow_wildcard === true && str.indexOf('*.') === 0) {
    str = str.substring(2);
  }

  var parts = str.split('.');
  var tld = parts[parts.length - 1];

  if (options.require_tld) {
    // disallow fqdns without tld
    if (parts.length < 2) {
      return false;
    }

    if (!/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    } // disallow spaces


    if (/\s/.test(tld)) {
      return false;
    }
  } // reject numeric TLDs


  if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
    return false;
  }

  return parts.every(function (part) {
    if (part.length > 63) {
      return false;
    }

    if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    } // disallow full-width chars


    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    } // disallow parts starting or ending with hyphen


    if (/^-|-$/.test(part)) {
      return false;
    }

    if (!options.allow_underscores && /_/.test(part)) {
      return false;
    }

    return true;
  });
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isFQDN, isFQDN.exports));

var isIP$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIP;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
11.3.  Examples

   The following addresses

             fe80::1234 (on the 1st link of the node)
             ff02::5678 (on the 5th link of the node)
             ff08::9abc (on the 10th organization of the node)

   would be represented as follows:

             fe80::1234%1
             ff02::5678%5
             ff08::9abc%10

   (Here we assume a natural translation from a zone index to the
   <zone_id> part, where the Nth zone of any scope is translated into
   "N".)

   If we use interface names as <zone_id>, those addresses could also be
   represented as follows:

            fe80::1234%ne0
            ff02::5678%pvc1.3
            ff08::9abc%interface10

   where the interface "ne0" belongs to the 1st link, "pvc1.3" belongs
   to the 5th link, and "interface10" belongs to the 10th organization.
 * * */
var IPv4SegmentFormat = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
var IPv4AddressFormat = "(".concat(IPv4SegmentFormat, "[.]){3}").concat(IPv4SegmentFormat);
var IPv4AddressRegExp = new RegExp("^".concat(IPv4AddressFormat, "$"));
var IPv6SegmentFormat = '(?:[0-9a-fA-F]{1,4})';
var IPv6AddressRegExp = new RegExp('^(' + "(?:".concat(IPv6SegmentFormat, ":){7}(?:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){6}(?:").concat(IPv4AddressFormat, "|:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){5}(?::").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,2}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){4}(?:(:").concat(IPv6SegmentFormat, "){0,1}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,3}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){3}(?:(:").concat(IPv6SegmentFormat, "){0,2}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,4}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){2}(?:(:").concat(IPv6SegmentFormat, "){0,3}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,5}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){1}(?:(:").concat(IPv6SegmentFormat, "){0,4}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,6}|:)|") + "(?::((?::".concat(IPv6SegmentFormat, "){0,5}:").concat(IPv4AddressFormat, "|(?::").concat(IPv6SegmentFormat, "){1,7}|:))") + ')(%[0-9a-zA-Z-.:]{1,})?$');

function isIP(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  (0, _assertString.default)(str);
  version = String(version);

  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  }

  if (version === '4') {
    if (!IPv4AddressRegExp.test(str)) {
      return false;
    }

    var parts = str.split('.').sort(function (a, b) {
      return a - b;
    });
    return parts[3] <= 255;
  }

  if (version === '6') {
    return !!IPv6AddressRegExp.test(str);
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isIP$1, isIP$1.exports));

var isIP = /*@__PURE__*/getDefaultExportFromCjs(isIP$1.exports);

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmail;

var _assertString = _interopRequireDefault(assertString.exports);

var _merge = _interopRequireDefault(merge.exports);

var _isByteLength = _interopRequireDefault(isByteLength.exports);

var _isFQDN = _interopRequireDefault(isFQDN.exports);

var _isIP = _interopRequireDefault(isIP$1.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_email_options = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
  blacklisted_chars: '',
  ignore_max_length: false,
  host_blacklist: []
};
/* eslint-disable max-len */

/* eslint-disable no-control-regex */

var splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i;
var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
var gmailUserPart = /^[a-z\d]+$/;
var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
var defaultMaxEmailLength = 254;
/* eslint-enable max-len */

/* eslint-enable no-control-regex */

/**
 * Validate display name according to the RFC2822: https://tools.ietf.org/html/rfc2822#appendix-A.1.2
 * @param {String} display_name
 */

function validateDisplayName(display_name) {
  var display_name_without_quotes = display_name.replace(/^"(.+)"$/, '$1'); // display name with only spaces is not valid

  if (!display_name_without_quotes.trim()) {
    return false;
  } // check whether display name contains illegal character


  var contains_illegal = /[\.";<>]/.test(display_name_without_quotes);

  if (contains_illegal) {
    // if contains illegal characters,
    // must to be enclosed in double-quotes, otherwise it's not a valid display name
    if (display_name_without_quotes === display_name) {
      return false;
    } // the quotes in display name must start with character symbol \


    var all_start_with_back_slash = display_name_without_quotes.split('"').length === display_name_without_quotes.split('\\"').length;

    if (!all_start_with_back_slash) {
      return false;
    }
  }

  return true;
}

function isEmail(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_email_options);

  if (options.require_display_name || options.allow_display_name) {
    var display_email = str.match(splitNameAddress);

    if (display_email) {
      var display_name = display_email[1]; // Remove display name and angle brackets to get email address
      // Can be done in the regex but will introduce a ReDOS (See  #1597 for more info)

      str = str.replace(display_name, '').replace(/(^<|>$)/g, ''); // sometimes need to trim the last space to get the display name
      // because there may be a space between display name and email address
      // eg. myname <address@gmail.com>
      // the display name is `myname` instead of `myname `, so need to trim the last space

      if (display_name.endsWith(' ')) {
        display_name = display_name.substr(0, display_name.length - 1);
      }

      if (!validateDisplayName(display_name)) {
        return false;
      }
    } else if (options.require_display_name) {
      return false;
    }
  }

  if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
    return false;
  }

  var parts = str.split('@');
  var domain = parts.pop();
  var lower_domain = domain.toLowerCase();

  if (options.host_blacklist.includes(lower_domain)) {
    return false;
  }

  var user = parts.join('@');

  if (options.domain_specific_validation && (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com')) {
    /*
      Previously we removed dots for gmail addresses before validating.
      This was removed because it allows `multiple..dots@gmail.com`
      to be reported as valid, but it is not.
      Gmail only normalizes single dots, removing them from here is pointless,
      should be done in normalizeEmail
    */
    user = user.toLowerCase(); // Removing sub-address from username before gmail validation

    var username = user.split('+')[0]; // Dots are not included in gmail length restriction

    if (!(0, _isByteLength.default)(username.replace(/\./g, ''), {
      min: 6,
      max: 30
    })) {
      return false;
    }

    var _user_parts = username.split('.');

    for (var i = 0; i < _user_parts.length; i++) {
      if (!gmailUserPart.test(_user_parts[i])) {
        return false;
      }
    }
  }

  if (options.ignore_max_length === false && (!(0, _isByteLength.default)(user, {
    max: 64
  }) || !(0, _isByteLength.default)(domain, {
    max: 254
  }))) {
    return false;
  }

  if (!(0, _isFQDN.default)(domain, {
    require_tld: options.require_tld
  })) {
    if (!options.allow_ip_domain) {
      return false;
    }

    if (!(0, _isIP.default)(domain)) {
      if (!domain.startsWith('[') || !domain.endsWith(']')) {
        return false;
      }

      var noBracketdomain = domain.substr(1, domain.length - 2);

      if (noBracketdomain.length === 0 || !(0, _isIP.default)(noBracketdomain)) {
        return false;
      }
    }
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
  var user_parts = user.split('.');

  for (var _i = 0; _i < user_parts.length; _i++) {
    if (!pattern.test(user_parts[_i])) {
      return false;
    }
  }

  if (options.blacklisted_chars) {
    if (user.search(new RegExp("[".concat(options.blacklisted_chars, "]+"), 'g')) !== -1) { return false; }
  }

  return true;
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isEmail$1, isEmail$1.exports));

var isEmail = /*@__PURE__*/getDefaultExportFromCjs(isEmail$1.exports);

var isInt$2 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInt;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
var intLeadingZeroes = /^[-+]?[0-9]+$/;

function isInt(str, options) {
  (0, _assertString.default)(str);
  options = options || {}; // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.

  var regex = options.hasOwnProperty('allow_leading_zeroes') && !options.allow_leading_zeroes ? int : intLeadingZeroes; // Check min/max/lt/gt

  var minCheckPassed = !options.hasOwnProperty('min') || str >= options.min;
  var maxCheckPassed = !options.hasOwnProperty('max') || str <= options.max;
  var ltCheckPassed = !options.hasOwnProperty('lt') || str < options.lt;
  var gtCheckPassed = !options.hasOwnProperty('gt') || str > options.gt;
  return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isInt$2, isInt$2.exports));

var isInt$1 = /*@__PURE__*/getDefaultExportFromCjs(isInt$2.exports);

var isFloat$1 = {};

var alpha$1 = {};

Object.defineProperty(alpha$1, "__esModule", {
  value: true
});
alpha$1.commaDecimal = alpha$1.dotDecimal = alpha$1.farsiLocales = alpha$1.arabicLocales = alpha$1.englishLocales = alpha$1.decimal = alpha$1.alphanumeric = alpha$1.alpha = void 0;
var alpha = {
  'en-US': /^[A-Z]+$/i,
  'az-AZ': /^[A-VXYZÇƏĞİıÖŞÜ]+$/i,
  'bg-BG': /^[А-Я]+$/i,
  'cs-CZ': /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'da-DK': /^[A-ZÆØÅ]+$/i,
  'de-DE': /^[A-ZÄÖÜß]+$/i,
  'el-GR': /^[Α-ώ]+$/i,
  'es-ES': /^[A-ZÁÉÍÑÓÚÜ]+$/i,
  'fa-IR': /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/i,
  'fi-FI': /^[A-ZÅÄÖ]+$/i,
  'fr-FR': /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'it-IT': /^[A-ZÀÉÈÌÎÓÒÙ]+$/i,
  'nb-NO': /^[A-ZÆØÅ]+$/i,
  'nl-NL': /^[A-ZÁÉËÏÓÖÜÚ]+$/i,
  'nn-NO': /^[A-ZÆØÅ]+$/i,
  'hu-HU': /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'pl-PL': /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  'ru-RU': /^[А-ЯЁ]+$/i,
  'sl-SI': /^[A-ZČĆĐŠŽ]+$/i,
  'sk-SK': /^[A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  'sr-RS@latin': /^[A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[А-ЯЂЈЉЊЋЏ]+$/i,
  'sv-SE': /^[A-ZÅÄÖ]+$/i,
  'th-TH': /^[ก-๐\s]+$/i,
  'tr-TR': /^[A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[А-ЩЬЮЯЄIЇҐі]+$/i,
  'vi-VN': /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  'ku-IQ': /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[א-ת]+$/,
  fa: /^['آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی']+$/i,
  'hi-IN': /^[\u0900-\u0961]+[\u0972-\u097F]*$/i
};
alpha$1.alpha = alpha;
var alphanumeric = {
  'en-US': /^[0-9A-Z]+$/i,
  'az-AZ': /^[0-9A-VXYZÇƏĞİıÖŞÜ]+$/i,
  'bg-BG': /^[0-9А-Я]+$/i,
  'cs-CZ': /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'da-DK': /^[0-9A-ZÆØÅ]+$/i,
  'de-DE': /^[0-9A-ZÄÖÜß]+$/i,
  'el-GR': /^[0-9Α-ω]+$/i,
  'es-ES': /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
  'fi-FI': /^[0-9A-ZÅÄÖ]+$/i,
  'fr-FR': /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'it-IT': /^[0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
  'hu-HU': /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'nb-NO': /^[0-9A-ZÆØÅ]+$/i,
  'nl-NL': /^[0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
  'nn-NO': /^[0-9A-ZÆØÅ]+$/i,
  'pl-PL': /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[0-9A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  'ru-RU': /^[0-9А-ЯЁ]+$/i,
  'sl-SI': /^[0-9A-ZČĆĐŠŽ]+$/i,
  'sk-SK': /^[0-9A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  'sr-RS@latin': /^[0-9A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
  'sv-SE': /^[0-9A-ZÅÄÖ]+$/i,
  'th-TH': /^[ก-๙\s]+$/i,
  'tr-TR': /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[0-9А-ЩЬЮЯЄIЇҐі]+$/i,
  'ku-IQ': /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  'vi-VN': /^[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[0-9א-ת]+$/,
  fa: /^['0-9آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی۱۲۳۴۵۶۷۸۹۰']+$/i,
  'hi-IN': /^[\u0900-\u0963]+[\u0966-\u097F]*$/i
};
alpha$1.alphanumeric = alphanumeric;
var decimal = {
  'en-US': '.',
  ar: '٫'
};
alpha$1.decimal = decimal;
var englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM'];
alpha$1.englishLocales = englishLocales;

for (var locale, i = 0; i < englishLocales.length; i++) {
  locale = "en-".concat(englishLocales[i]);
  alpha[locale] = alpha['en-US'];
  alphanumeric[locale] = alphanumeric['en-US'];
  decimal[locale] = decimal['en-US'];
} // Source: http://www.localeplanet.com/java/


var arabicLocales = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'QM', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE'];
alpha$1.arabicLocales = arabicLocales;

for (var _locale, _i = 0; _i < arabicLocales.length; _i++) {
  _locale = "ar-".concat(arabicLocales[_i]);
  alpha[_locale] = alpha.ar;
  alphanumeric[_locale] = alphanumeric.ar;
  decimal[_locale] = decimal.ar;
}

var farsiLocales = ['IR', 'AF'];
alpha$1.farsiLocales = farsiLocales;

for (var _locale2, _i2 = 0; _i2 < farsiLocales.length; _i2++) {
  _locale2 = "fa-".concat(farsiLocales[_i2]);
  alphanumeric[_locale2] = alphanumeric.fa;
  decimal[_locale2] = decimal.ar;
} // Source: https://en.wikipedia.org/wiki/Decimal_mark


var dotDecimal = ['ar-EG', 'ar-LB', 'ar-LY'];
alpha$1.dotDecimal = dotDecimal;
var commaDecimal = ['bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-ZM', 'es-ES', 'fr-CA', 'fr-FR', 'id-ID', 'it-IT', 'ku-IQ', 'hi-IN', 'hu-HU', 'nb-NO', 'nn-NO', 'nl-NL', 'pl-PL', 'pt-PT', 'ru-RU', 'sl-SI', 'sr-RS@latin', 'sr-RS', 'sv-SE', 'tr-TR', 'uk-UA', 'vi-VN'];
alpha$1.commaDecimal = commaDecimal;

for (var _i3 = 0; _i3 < dotDecimal.length; _i3++) {
  decimal[dotDecimal[_i3]] = decimal['en-US'];
}

for (var _i4 = 0; _i4 < commaDecimal.length; _i4++) {
  decimal[commaDecimal[_i4]] = ',';
}

alpha['fr-CA'] = alpha['fr-FR'];
alphanumeric['fr-CA'] = alphanumeric['fr-FR'];
alpha['pt-BR'] = alpha['pt-PT'];
alphanumeric['pt-BR'] = alphanumeric['pt-PT'];
decimal['pt-BR'] = decimal['pt-PT']; // see #862

alpha['pl-Pl'] = alpha['pl-PL'];
alphanumeric['pl-Pl'] = alphanumeric['pl-PL'];
decimal['pl-Pl'] = decimal['pl-PL']; // see #1455

alpha['fa-AF'] = alpha.fa;

Object.defineProperty(isFloat$1, "__esModule", {
  value: true
});
var _default = isFloat$1.default = isFloat;
isFloat$1.locales = void 0;

var _assertString = _interopRequireDefault(assertString.exports);

var _alpha = alpha$1;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isFloat(str, options) {
  (0, _assertString.default)(str);
  options = options || {};
  var float = new RegExp("^(?:[-+])?(?:[0-9]+)?(?:\\".concat(options.locale ? _alpha.decimal[options.locale] : '.', "[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$"));

  if (str === '' || str === '.' || str === '-' || str === '+') {
    return false;
  }

  var value = parseFloat(str.replace(',', '.'));
  return float.test(str) && (!options.hasOwnProperty('min') || value >= options.min) && (!options.hasOwnProperty('max') || value <= options.max) && (!options.hasOwnProperty('lt') || value < options.lt) && (!options.hasOwnProperty('gt') || value > options.gt);
}

var locales = Object.keys(_alpha.decimal);
isFloat$1.locales = locales;

var isHexadecimal$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHexadecimal;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hexadecimal = /^(0x|0h)?[0-9A-F]+$/i;

function isHexadecimal(str) {
  (0, _assertString.default)(str);
  return hexadecimal.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isHexadecimal$1, isHexadecimal$1.exports));

var isHexadecimal = /*@__PURE__*/getDefaultExportFromCjs(isHexadecimal$1.exports);

var isHexColor$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHexColor;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;

function isHexColor(str) {
  (0, _assertString.default)(str);
  return hexcolor.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isHexColor$1, isHexColor$1.exports));

var isHexColor = /*@__PURE__*/getDefaultExportFromCjs(isHexColor$1.exports);

var isRgbColor$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRgbColor;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
var rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
var rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)/;
var rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)/;

function isRgbColor(str) {
  var includePercentValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  (0, _assertString.default)(str);

  if (!includePercentValues) {
    return rgbColor.test(str) || rgbaColor.test(str);
  }

  return rgbColor.test(str) || rgbaColor.test(str) || rgbColorPercent.test(str) || rgbaColorPercent.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isRgbColor$1, isRgbColor$1.exports));

var isRgbColor = /*@__PURE__*/getDefaultExportFromCjs(isRgbColor$1.exports);

var isUUID$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isUUID;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuid = {
  1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

function isUUID(str, version) {
  (0, _assertString.default)(str);
  var pattern = uuid[![undefined, null].includes(version) ? version : 'all'];
  return !!pattern && pattern.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isUUID$1, isUUID$1.exports));

var isUUID = /*@__PURE__*/getDefaultExportFromCjs(isUUID$1.exports);

var isHash$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHash;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lengths = {
  md5: 32,
  md4: 32,
  sha1: 40,
  sha256: 64,
  sha384: 96,
  sha512: 128,
  ripemd128: 32,
  ripemd160: 40,
  tiger128: 32,
  tiger160: 40,
  tiger192: 48,
  crc32: 8,
  crc32b: 8
};

function isHash(str, algorithm) {
  (0, _assertString.default)(str);
  var hash = new RegExp("^[a-fA-F0-9]{".concat(lengths[algorithm], "}$"));
  return hash.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isHash$1, isHash$1.exports));

var isHash = /*@__PURE__*/getDefaultExportFromCjs(isHash$1.exports);

var isMimeType$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMimeType;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Checks if the provided string matches to a correct Media type format (MIME type)

  This function only checks is the string format follows the
  etablished rules by the according RFC specifications.
  This function supports 'charset' in textual media types
  (https://tools.ietf.org/html/rfc6657).

  This function does not check against all the media types listed
  by the IANA (https://www.iana.org/assignments/media-types/media-types.xhtml)
  because of lightness purposes : it would require to include
  all these MIME types in this librairy, which would weigh it
  significantly. This kind of effort maybe is not worth for the use that
  this function has in this entire librairy.

  More informations in the RFC specifications :
  - https://tools.ietf.org/html/rfc2045
  - https://tools.ietf.org/html/rfc2046
  - https://tools.ietf.org/html/rfc7231#section-3.1.1.1
  - https://tools.ietf.org/html/rfc7231#section-3.1.1.5
*/
// Match simple MIME types
// NB :
//   Subtype length must not exceed 100 characters.
//   This rule does not comply to the RFC specs (what is the max length ?).
var mimeTypeSimple = /^(application|audio|font|image|message|model|multipart|text|video)\/[a-zA-Z0-9\.\-\+]{1,100}$/i; // eslint-disable-line max-len
// Handle "charset" in "text/*"

var mimeTypeText = /^text\/[a-zA-Z0-9\.\-\+]{1,100};\s?charset=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?$/i; // eslint-disable-line max-len
// Handle "boundary" in "multipart/*"

var mimeTypeMultipart = /^multipart\/[a-zA-Z0-9\.\-\+]{1,100}(;\s?(boundary|charset)=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?){0,2}$/i; // eslint-disable-line max-len

function isMimeType(str) {
  (0, _assertString.default)(str);
  return mimeTypeSimple.test(str) || mimeTypeText.test(str) || mimeTypeMultipart.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isMimeType$1, isMimeType$1.exports));

var isMimeType = /*@__PURE__*/getDefaultExportFromCjs(isMimeType$1.exports);

var isMongoId$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMongoId;

var _assertString = _interopRequireDefault(assertString.exports);

var _isHexadecimal = _interopRequireDefault(isHexadecimal$1.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isMongoId(str) {
  (0, _assertString.default)(str);
  return (0, _isHexadecimal.default)(str) && str.length === 24;
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isMongoId$1, isMongoId$1.exports));

var isMongoId = /*@__PURE__*/getDefaultExportFromCjs(isMongoId$1.exports);

var isLength$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLength;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable prefer-rest-params */
function isLength(str, options) {
  (0, _assertString.default)(str);
  var min;
  var max;

  if (_typeof(options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isLength(str, min [, max])
    min = arguments[1] || 0;
    max = arguments[2];
  }

  var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
  var len = str.length - surrogatePairs.length;
  return len >= min && (typeof max === 'undefined' || len <= max);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isLength$1, isLength$1.exports));

var isLength = /*@__PURE__*/getDefaultExportFromCjs(isLength$1.exports);

var isBoolean$1 = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBoolean;

var _assertString = _interopRequireDefault(assertString.exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  loose: false
};
var strictBooleans = ['true', 'false', '1', '0'];
var looseBooleans = [].concat(strictBooleans, ['yes', 'no']);

function isBoolean(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;
  (0, _assertString.default)(str);

  if (options.loose) {
    return looseBooleans.includes(str.toLowerCase());
  }

  return strictBooleans.includes(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
}(isBoolean$1, isBoolean$1.exports));

var isBoolean = /*@__PURE__*/getDefaultExportFromCjs(isBoolean$1.exports);

function assert$1(judge, msg) {
    if (!judge) { throw new Error(msg) }
}

function extend(target) {
    if ( target === void 0 ) target = {};
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var length = args.length;
    var options, name, src, copy;
    if (!target) {
        target = isArray$1(args[0]) ? [] : {};
    }
    for (var i = 0; i < length; i++) {
        options = args[i];
        if (!options) {
            continue
        }
        for (name in options) {
            src = target[name];
            copy = options[name];
            if (src && src === copy) {
                continue
            }
            if (isArray$1(copy)) {
                target[name] = extend([], copy);
            } else if (isObject$1(copy)) {
                target[name] = extend(src && isObject$1(src) ? src : {}, copy);
            } else {
                target[name] = copy;
            }
        }
    }
    return target
}

function isTrueNaN(obj) {
    return typeof obj === 'number' && isNaN(obj)
}

function isTrueEmpty$1(obj) {
    return !!(obj === undefined || obj === '' || isTrueNaN(obj)) // null 在 mysql 等数据库中有意义，所以不能算无效值
}

function isFunction(obj) {
    return typeof obj === 'function'
}

function isArray$1(obj) {
    if (Array.isArray) { return Array.isArray(obj) }
    return Object.prototype.toString.call(obj) === '[object Array]'
}

function isString$1(obj) {
    return typeof obj === 'string'
}
function isNumber$1(obj) {
    return typeof obj === 'number'
}

function isObject$1(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

function isInt(obj) {
    if (Number.isInteger) { return Number.isInteger(obj) }
    return (obj | 0) === obj
}

function isRegExp$1(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]'
}

var assert = assert$1;
var isTrueEmpty = isTrueEmpty$1;
var isString = isString$1;
var isNumber = isNumber$1;
var isArray = isArray$1;
var isObject = isObject$1;
var isRegExp = isRegExp$1;
var isStringOrNumber = function (obj) { return isString(obj) || isNumber(obj); };

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

var Rules = {};

Rules.required = function () { return true; };
Rules._requiredIf = function (validValue, ref) {
    var rules = ref.rules;

    assert(isArray(validValue), 'requiredIf\'s value should be array');
    validValue = validValue.slice();
    validValue[0] = rules[validValue[0]].value;
    return validValue
};
Rules.requiredIf = function (value, ref) {
    var parsedValidValue = ref.parsedValidValue;

    var first = parsedValidValue[0];
    var others = parsedValidValue.slice(1);
    return others.indexOf(first) > -1
};
Rules._requiredNotIf = function (validValue, ref) {
    var rules = ref.rules;

    assert(isArray(validValue), 'requiredNotIf\'s value should be array');
    return Rules._requiredIf(validValue, {rules: rules})
};
Rules.requiredNotIf = function (value, ref) {
    var parsedValidValue = ref.parsedValidValue;

    var first = parsedValidValue[0];
    var others = parsedValidValue.slice(1);
    return others.indexOf(first) === -1
};
Rules._requiredWith = function (validValue, ref) {
    var rules = ref.rules;

    assert(isArray(validValue), 'requiredWith\'s value should be array');
    validValue = validValue.slice();
    return validValue.map(function (item) { return !isTrueEmpty(rules[item] && rules[item].value) ? rules[item].value : ''; })
};
Rules.requiredWith = function (value, ref) {
    var parsedValidValue = ref.parsedValidValue;

    return parsedValidValue.some(function (item) { return !isTrueEmpty(item); });
};
Rules._requiredWithAll = function (validValue, ref) {
    var rules = ref.rules;

    assert(isArray(validValue), 'requiredWithAll\'s value should be array');
    return Rules._requiredWith(validValue, {rules: rules})
};
Rules.requiredWithAll = function (value, ref) {
    var parsedValidValue = ref.parsedValidValue;

    return parsedValidValue.every(function (item) { return !isTrueEmpty(item); });
};
Rules._requiredWithOut = function (validValue, ref) {
    var rules = ref.rules;

    assert(isArray(validValue), 'requiredWithOut\'s value should be array');
    return Rules._requiredWith(validValue, {rules: rules})
};
Rules.requiredWithOut = function (value, ref) {
    var parsedValidValue = ref.parsedValidValue;

    return parsedValidValue.some(function (item) { return isTrueEmpty(item); });
};
Rules._requiredWithOutAll = function (validValue, ref) {
    var rules = ref.rules;

    assert(isArray(validValue), 'requiredWithOutAll\'s value should be array');
    return Rules._requiredWith(validValue, {rules: rules})
};
Rules.requiredWithOutAll = function (value, ref) {
    var parsedValidValue = ref.parsedValidValue;

    return parsedValidValue.every(function (item) { return isTrueEmpty(item); });
};

// 值必须包含某个特性的对象，类似 indexOf
Rules.contains = function (value, ref) {
    var validValue = ref.validValue;

    assert(isStringOrNumber(validValue), 'contains should be string or number');
    return isString(value) && isContains(value, validValue) // ignoreCase = 比较时忽略大小写; minOccurences = 最小出现的次数
};

Rules._equals = function (validValue, ref) {
    var rules = ref.rules;

    return rules[validValue].value;
};
Rules.equals = function (value, ref) {
    var parsedValidValue = ref.parsedValidValue;

    return value === parsedValidValue;
}; // 值必须和另外一个值相等
Rules._different = function (validValue, ref) {
    var rules = ref.rules;

    return Rules._equals(validValue, {rules: rules});
};
Rules.different = function (value, ref) {
    var parsedValidValue = ref.parsedValidValue;

    return value !== parsedValidValue;
}; // 和另一项的值不等

// 值只能是 [a-zA-Z] 组成
Rules.alpha = function (value) { return isString(value) && /^[A-Z]+$/i.test(value); };

// 值只能是 [a-zA-Z_] 组成
Rules.alphaDash = function (value) { return isString(value) && /^[A-Z_]+$/i.test(value); };

// 值只能是 [a-zA-Z0-9] 组成
Rules.alphaNumeric = function (value) { return isStringOrNumber(value) && /^[0-9A-Z]+$/i.test(String(value)); };

// 值只能是 [a-zA-Z0-9_] 组成
Rules.alphaNumericDash = function (value) { return isStringOrNumber(value) && /^\w+$/i.test(String(value)); };

// 值只能是 ascii 字符组成
// eslint-disable-next-line no-control-regex
Rules.ascii = function (value) { return isString(value) && /^[\x00-\x7F]+$/.test(value); };

// 值必须是 base64 编码
Rules.base64 = function (value, ref) {
    var validValue = ref.validValue;

    return isString(value) && isBase64(String(value), {urlSafe: !!(isObject(validValue) && (validValue.urlSafe || validValue.url))});
}; // urlSafe 是否 URL 安全

// 需要为信用卡数字
Rules.creditCard = function (value) {
    value = String(value);
    return isCreditCard(value)
};

// 需要为日期 yyyy-MM-dd 或 yyyy/MM/dd
function isValidDateString(dateStr) {
    if (typeof dateStr !== 'string') { return false }
    dateStr = dateStr.replace(/-/g, '/'); // 为了兼容苹果系统把日期的 "-" 换成 "/"
    return new Date(dateStr).getDate() == dateStr.split(' ')[0].substring(8) // 如果日期时间的 day 与文本时间的 day 相同表示该日期有效
}
Rules.date = function (value, ref) {
    var validValue = ref.validValue;

    var strict = typeof validValue === 'object' ? Boolean(strict) : false; // 是否为严格时间，如果为否仅验证格式不验证日期
    // const min before // 最小日期，会自动序列化，输入日期必须比该时间大
    // const max after // 最大日期，会自动序列化，输入日期必须比该时间小
    // return dataCheker(value) // !isNaN(Date.parse(value))
    value = String(value);
    var flag = /^[1-3]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value);
    if (!flag) { return false }
    if (strict && !isValidDateString(value)) { return false }
    return true
};
// 需要为时间 hh:mm:ss
Rules.time = function (value) {
    // const min // or 'start' 最小时间，输入时间总秒数必须比该时间大
    // const max // or 'end' 最大时间，输入时间总秒数必须比该时间小
    // const step // 步进值（意义不大），所选时间必须是步进值的倍数
    // const format // 时间格式：12小时制 或 24小时制（默认）
    value = String(value);
    var flag = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(value);
    if (!flag) { return false }
    return true
};
// 需要为日期时间 yyyy-MM-dd hh:mm:ss
Rules.datetime = function (value) {
    // const strict 是否为严格时间，如果为否仅验证格式不验证日期
    // const format // 时间格式：12小时制 或 24小时制（默认）
    value = String(value);
    var flag = /^[1-3]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(value);
    if (!flag) { return false }
    // if (strict && !isValidDateString(value)) return false
    return true
};
// 需要为日期范围 yyyy-MM-dd, yyyy-MM-dd
Rules.dateRange = function (value, ref) {
    var validValue = ref.validValue;

    // const strict 是否为严格时间，如果为否仅验证格式不验证日期
    // TODO 需要支持更多
    var range;
    if (typeof value === 'string') {
        range = value.split(',');
    } else if (Array.isArray(value)) {
        range = Array.from(value);
    } else {
        return false
    }
    if (range.length !== 2) { return false }
    return Rules.date(range[0], {validValue: validValue}) && Rules.date(range[1], {validValue: validValue})
};
// 需要为时间日期范围 yyyy-MM-dd hh:mm:ss, yyyy-MM-dd hh:mm:ss
Rules.datetimeRange = function (value, ref) {
    var validValue = ref.validValue;

    // const strict 是否为严格时间，如果为否仅验证格式不验证日期
    var range;
    if (typeof value === 'string') {
        range = value.split(',');
    } else if (Array.isArray(value)) {
        range = Array.from(value);
    } else {
        return false
    }
    if (range.length !== 2) { return false }
    return Rules.datetime(range[0], {validValue: validValue}) && Rules.datetime(range[1], {validValue: validValue})
};

// 需要为 ISO8601 时间格式
// 如果 strict = true，那么诸如 2009-02-29 不存在的日期将会无效
Rules.iso8601 = function (value) { return isString(value) && isISO8601(value, {strict: true, strictSeparator: true}); };

// // 需要为小数，例如：0.1， .3， 1.1， 1.00003， 4.0
// Rules.decimal = value => {
//     value = String(value);
//     return isDecimal(value);
// }

// 需要为手机号
// 第二个参数为 {String | Array<locale>} locale
Rules.mobile = function (value, ref) {
    var validValue = ref.validValue;

    return isStringOrNumber(value) && _default$1(String(value), validValue && typeof validValue === 'string' ? validValue : 'zh-CN');
};

// 需要为 email 格式, options 参见 https://github.com/chriso/validator.js
Rules.email = function (value, ref) {
    var validValue = ref.validValue;

    assert(isObject(validValue) || validValue === true, 'email\'s value should be object or true');
    return isString(value) && isEmail(value, validValue === true ? undefined : validValue)
};

// 需要为 int 型
Rules.int = function (value, ref) {
    var validValue = ref.validValue;

    assert(isObject(validValue) || validValue === true, 'int\'s value should be object or true');
    return isStringOrNumber(value) && isInt$1(String(value), typeof validValue === 'object' ? validValue : undefined)
};

//需要为浮点数
Rules.float = function (value, ref) {
    var validValue = ref.validValue;

    assert(isObject(validValue) || validValue === true, 'float\'s value should be object or true');
    value = String(value);
    if (!_default(value)) { return false }
    if (isObject(validValue)) {
        if (!_default(value, validValue)) { return 'range' }
        if (validValue.decimal) {
            assert(isNumber(validValue.decimal), 'float.decimal should be number');
            var decimal = ("" + value).split('.')[1];
            if (decimal && decimal.length > validValue.decimal) { return 'decimal' }
        }
    }
    return true
};

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
Rules.hexColor = function (value) { return isString(value) && isHexColor(value); };
// 需要为个十六进制颜色值
Rules.rgbColor = function (value) { return isString(value) && isRgbColor(value); };

// 需要为十六进制
Rules.hex = function (value) { return isString(value) && isHexadecimal(value); };

// 需要为 ip 格式
Rules.ip = function (value, ref) {
    var validValue = ref.validValue;

    var version = validValue == 4 || validValue == 6 ? Number(validValue) : undefined;
    return isString(value) && isIP(value, version)
};

// 需要为 ip4 格式
Rules.ip4 = function (value) { return isString(value) && isIP(value, 4); };

// 需要为 ip6 格式
Rules.ip6 = function (value) { return isString(value) && isIP(value, 6); };

// 需要为 UUID（1, 2, 3，4，5 版本)
Rules.uuid = function (value, ref) {
    var validValue = ref.validValue;

    var version = validValue == 1 || validValue == 2 || validValue == 3 || validValue == 4 || validValue == 5 ? Number(validValue) : undefined;
    return isString(value) && isUUID(value, version)
};

// 需要为 md5
Rules.md5 = function (value) { return isString(value) && isHash(value, 'md5'); };

// 需要为 sha256
Rules.sha256 = function (value) { return isString(value) && isHash(value, 'sha256'); };

// 需要为 hash 值
Rules.hash = function (value, ref) {
    var validValue = ref.validValue;

    assert(!!~["md4", "md5", "sha1", "sha256", "sha384", "sha512", "ripemd128", "ripemd160", "tiger128", "tiger160", "tiger192", "crc32", "crc32b"].indexOf(validValue), 'hash value should like "md5"、"sha256"、"sha512"...');
    return isString(value) && isHash(value, validValue)
};

// 需要为 mimeType 类型
// 参见 https://en.wikipedia.org/wiki/Media_type
// 诸如 image/* 是不符合验证规则的
Rules.mimeType = function (value) { return isString(value) && isMimeType(value); };

// 在某些值中
Rules.in = function (value, ref) {
    var validValue = ref.validValue;

    assert(isArray(validValue), 'in\'s value should be array');
    if (isArray(validValue)) {
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
};

// 不能在某些值中
Rules.notIn = function (value, ref) {
    var validValue = ref.validValue;

    assert(isArray(validValue), 'notIn\'s value should be array');
    return !Rules.in(value, {validValue: validValue})
};

// 从属于某些值中
Rules.checkbox = function (value, ref) {
    var validValue = ref.validValue;

    assert(isArray(validValue), 'validValue\'s value should be array');
    if (!isArray(value)) { return Rules.in(value, {validValue: validValue}) }
    var map = {};
    var isRepeat = false;
    var flag = value.every(function (item) {
        var valid = !!validValue.find(function (row) { return row === item; });
        if (valid && map[item]) {
            isRepeat = true;
            return false
        }
        map[item] = true;
        return valid
    });
    return isRepeat ? 'repeat' : flag
};

// 长度需要在某个范围
Rules.length = function (value, ref) {
    var validValue = ref.validValue;
    var rule = ref.rule;

    if (rule.array) {
        return Rules.array(value, {validValue: validValue}) // 除了数组使用长度进行验证，其他当成字符串来处理
    } else {
        assert(isObject(validValue) || isInt(validValue), 'length\'s value should be object or integer');
        if (isObject(validValue)) {
            return isLength(String(value), {min: validValue.min | 0, max: validValue.max})
        } else {
            assert(validValue > 0, 'length\'s value should be integer larger than zero');
            return isLength(String(value), {min: validValue, max: validValue})
        }
    }
};

// 需要都是小写字母
Rules.lowercase = function (value) { return isString(value) && value === value.toLowerCase(); };

// 需要都是大写字母
Rules.uppercase = function (value) { return isString(value) && value === value.toUpperCase(); };

// 需要为 MongoDB 的 ObjectID
Rules.mongoId = function (value) { return isString(value) && isMongoId(value); };

// 需要为数据库查询 order, 如 'id ASC'  'name DESC' 或 'id ASC, name DESC'
Rules.sqlOrder = function (value) { return isString(value) && value.split(/\s*,\s*/).every(function (item) { return /^\w+\s+(?:ASC|DESC)$/i.test(item); }); };

// 需要为数据库查询的字段
Rules.sqlField = function (value) { return isString(value) && value.split(/\s*,\s*/).every(function (item) { return item === '*' || /^\w+$/.test(item); }); };

// 需要以某些字符打头
Rules.startWith = function (value, ref) {
    var validValue = ref.validValue;

    return isString(value) && value.indexOf(validValue) === 0;
};

// 需要以某些字符结束
Rules.endWith = function (value, ref) {
    var validValue = ref.validValue;

    return isString(value) && value.lastIndexOf(validValue) === value.length - validValue.length;
};

// 需要为字符串
Rules.string = function (value, ref) {
    var validValue = ref.validValue;
    var rule = ref.rule;

    assert(isObject(validValue) || isInt(validValue) || validValue === true, 'string\'s value should be object, integer or true');
    if (!isString(value)) { return false }
    if (validValue !== true && Rules.length(value, {validValue: validValue, rule: rule}) !== true) { return 'length' }
    return true
};


// 需要为布尔类型
// 以下集合都能符合判定 [true, 'true', 'True', 'TRUE', 1, '1'], [false, 'false', 'False', 'FALSE', 0, '0']
// 若需要更精准的匹配推荐使用 Rules.in 验证
Rules.boolean = function (value) { return isBoolean(String(value)); };

// 字段值要匹配给出的正则
Rules.regexp = function (value, ref) {
    var validValue = ref.validValue;

    assert(isRegExp(validValue), 'argument should be regexp');
    return validValue.test(value)
};

// 需要为数组
Rules.array = function (value, ref) {
    var validValue = ref.validValue;

    assert(isObject(validValue) || validValue === true, 'array\'s value should be object or true');
    if (!isArray(value)) { return false }
    if (validValue && typeof validValue === 'object') {
        if (typeof validValue.min === 'number' && validValue.min > value.length) { return 'range' }
        if (typeof validValue.max === 'number' && validValue.max < value.length) { return 'range' }
        if (typeof validValue.lt === 'number' && validValue.lt <= value.length) { return 'range' }
        if (typeof validValue.gt === 'number' && validValue.gt >= value.length) { return 'range' }
    }
    return true
};

// 需要为对象
Rules.object = function (value) { return isObject(value); };

var Messages = {};

/**
 * @class 验证器
 */
var Validator = function Validator(config) {
    if ( config === void 0 ) config = {};


    // 继承默认设置
    var opts = extend({
        ignoreRuleKeys: extend([], config.ignoreRuleKeys), // origin: ['value', 'default', 'trim', 'method', 'aliasName']; engine: ['title', 'placeholder', 'defaultDoc', 'description', 'mode']; new: ['title']
        locale: 'zh', // 默认使用中文
        strict: false, // 是否启用严格模式
        stringEmpty: true, // 是否允许空字符串，当 '' 是否被判定为 undefined 处理（非 rule.string 与 rule.array 会强制以 undefined 处理）
        assert: undefined // [未实装] 断言库
    }, isObject$1(config) ? config : {});

    // 赋值设置信息locale
    this.basicType = ['int', 'string', 'float', 'array', 'object', 'boolean']; // 基本类型，最多既能同时存在一个
    this.requiredValidNames = ['required', 'requiredIf', 'requiredNotIf', 'requiredWith', 'requiredWithAll', 'requiredWithOut', 'requiredWithOutAll']; // 必穿参数验证
    this.ignoreRuleKeys = ['value', 'default', 'trim', 'aliasName', 'children', 'allowNull'].concat(this.requiredValidNames).concat(opts.ignoreRuleKeys);
    this.locale = opts.locale;
    this.strict = opts.strict; // 是否严格模式
    this.stringEmpty = opts.stringEmpty;
    this.assert = opts.assert;
};


/**
 * 验证失败后，用于获取失败提示信息
 * @param {*} param
 * @param {String} errType - 错误类型
 * @returns
 */
Validator.prototype._getErrorMessage = function _getErrorMessage (ref, ref$1) {
        var argName = ref.argName;
        var rule = ref.rule;
        var validName = ref.validName;
        var parsedValidValue = ref.parsedValidValue;
        if ( ref$1 === void 0 ) ref$1 = {};
        var messages = ref$1.messages; if ( messages === void 0 ) messages = {};
        var locale = ref$1.locale;
        var errType = ref$1.errType; if ( errType === void 0 ) errType = '';


    var _isErrorType = function (error) { return error && (isString$1(error) || isFunction(error)); }; // error 信息是允许 function handler
    if (this.requiredValidNames.indexOf(validName) > -1) {
        validName = 'required';
    }

    // 取验证名，一般验证名都会存在
    var getMessagesString = function (messages) {
        if (errType && _isErrorType(messages[(validName + ":" + errType)])) {
            return messages[(validName + ":" + errType)]
        } else if (_isErrorType(messages[validName])) {
            return messages[validName]
        }
    };
    var errMsg = getMessagesString(messages);
    if (!errMsg) {
        if (!locale) { locale = this.locale; }
        if (locale && isObject$1(Messages[locale])) {
            errMsg = getMessagesString(Messages[locale]);
        }
    }

    // const validNameError = this.errors[validName] // 验证名
    // if (_isErrorType(validNameError)) {
    // errMsg = validNameError;
    // }

    // let argNameError = this.errors[argName] // 字段名（如果字段名存在，则优先使用）
    // if (_isErrorType(argNameError)) {
    // errMsg = argNameError;
    // }

    // // [error message]: { username: { string: 'the error message' } }
    // if (isObject(argNameError)) {
    // const validArgNameError = this.errors[argName][validName];  // 字段名 + 验证名（如果字段名 + 验证名存在，则高优先级使用）
    // if (_isErrorType(validArgNameError)) {
    //     errMsg = validArgNameError;
    // }
    // }

    if (!errMsg) {
        return (rule.aliasName || argName) + ' valid failed'
    }

    var validValue = rule[validName];

    // 支持自定义消息的功能
    // support function as the custom message
    if (isFunction(errMsg)) {
        var lastErrorMsg$1 = errMsg({
            name: argName,
            validName: validName,
            rule: rule,
            args: validValue,
            pargs: parsedValidValue
        });
        assert$1(isString$1(lastErrorMsg$1), 'custom error function should return string.');
        return lastErrorMsg$1
    }

    // 拼装模板字符串
    var lastErrorMsg = errMsg.replace('{name}', rule.aliasName || argName)
        .replace('{args}', isString$1(validValue) ? validValue : JSON.stringify(validValue))
        .replace('{pargs}', isString$1(parsedValidValue) ? parsedValidValue : JSON.stringify(parsedValidValue));
    return lastErrorMsg
};

/**
 * 使用 validName 方法分析有效参数
 * 某些字段需要和另外一个字段进行交叉对比的，在 Rules 中提供 _ 函数
 * @return {Mixed} [description]
 */
Validator.prototype._parseValidValue = function _parseValidValue (ref) {
        var validName = ref.validName;
        var rule = ref.rule;
        var rules = ref.rules;
        var argName = ref.argName;
        var ctx = ref.ctx;

    var validValue = rule[validName];
    var _fn = Rules['_' + validName];
    return isFunction(_fn) ? _fn(validValue, {argName: argName, validName: validName, ctx: ctx, rule: rule, rules: rules}) : validValue
};


/**
 * 如果需要，请检查值
 * @return {Boolean}  [description]
 */
Validator.prototype._isArgRequired = function _isArgRequired (gather) {
    var isRequired = false;
    for (var i = 0; i <= this.requiredValidNames.length; i++) {
        var validName = this.requiredValidNames[i];
        if (gather.rule[validName]) {
            var fn = Rules[validName];

            gather.validName = validName;
            gather.validValue = gather.rule[validName];
            gather.parsedValidValue = this._parseValidValue({validName: validName, rule: gather.rule, rules: gather.rules, argName: gather.argName, ctx: gather.ctx});

            if (fn(gather.rule.value, gather)) {
                isRequired = true;
                break
            }
        }
    }
    return isRequired
};

/**
 * 预处理规则
 * 会自动从 ctx 或 params 获取 value 并合并到 rules 中并返回
 * @param {Object} rules - 规则
 * @param {Object} gather - 外部参数
 * @param {Boolean} opts.isDeep - 是否为深度对象
 * @param {Boolean} opts.stringEmpty - 是否允许空字符串（不允许会以 undefined 处理）
 */
Validator.prototype._preTreatRules = function _preTreatRules (originRules, gather, ref) {
        if ( ref === void 0 ) ref = {};
        var isDeep = ref.isDeep;
        var stringEmpty = ref.stringEmpty;

    var rules = {};
    var _gather = isDeep ? gather : extend({}, gather); // 深层对象保留引用关系
    for (var argName in originRules) {
        var value = _gather[argName];
        rules[argName] = this._preTreatRule(originRules[argName], value, argName, {stringEmpty: stringEmpty}); // 规则单条实例
    }
    return rules
};
Validator.prototype._preTreatRule = function _preTreatRule (originRule, value, argName, ref) {
        if ( ref === void 0 ) ref = {};
        var stringEmpty = ref.stringEmpty;


    var rule = extend({}, originRule);

    // 一个字段仅能设置一个基本类型，否则会报错
    var containTypeNum = this.basicType.reduce(function (acc, val) {
        val = rule[val] ? 1 : 0;
        return acc + val
    }, 0);

    if (containTypeNum > 1) {
        throw new Error('Any rule can\'t contains one more basic type, the param you are validing is ' + argName)
    }

    if (rule.value === undefined) {
        rule.value = value;  // 获取验证值
    }

    if (!this.strict) {

        if ((rule.value === undefined || rule.string && rule.value === '') && rule.default !== undefined) {
            rule.value = rule.default; // 若值无效则取规则中的默认值（null 属于有效值，所以仅判断 undefined 和 ''）
        }
        if (rule.value === '' && !rule.string) {
            if (stringEmpty && rule.array) {
                rule.value = []; // 特殊规则，如果是空字符串，会自动转为空数组
            } else {
                rule.value = undefined; // 除了 rule.string = true 情况下，其他条件 value = '' 时转换为 undefined
            }
        }
        if (rule.string) {
            // 字符串预处理
            if (typeof rule.value !== 'string' && rule.value && typeof rule.value.toString === 'function') {
                rule.value = rule.value.toString(); // 自动转为字符串
            }
            if (rule.trim && rule.value && typeof rule.value.trim === 'function') {
                rule.value = rule.value.trim(); // 去除头尾的空格
            }
        } else if (rule.boolean) {
            // 布尔值类型转换
            if (rule.value !== undefined) {
                if ([true, 'true', 'True', 'TRUE', '1', 1].indexOf(rule.value) > -1) {
                    rule.value = true;
                } else if ([false, 'false', 'False', 'FALSE', '0', 0].indexOf(rule.value) > -1) {
                    rule.value = false;
                }
            }
        } else if (rule.array) {
            // 数组预处理
            if (!isArray$1(rule.value)) {
                // 数组类型转换
                if (rule.value && isString$1(rule.value)) {
                    try {
                        rule.value = JSON.parse(rule.value);
                        if (!isArray$1(rule.value)) {
                            rule.value = [rule.value]; // 如果只传一个数字可能会被 number 化
                        }
                    } catch (e) {
                        if (rule.value.indexOf(',') > -1) {
                            rule.value = rule.value.split(',');
                        } else {
                            rule.value = [rule.value];
                        }
                    }
                }
            }
        } else if (rule.object) {
            // 对象类型转换
            if (!isObject$1(rule.value)) {
                if (rule.value && isString$1(rule.value)) {
                    try {
                        rule.value = JSON.parse(rule.value);
                    } catch (e$1) {}
                }
            }
        }
    }
    return rule
};


/**
 * 验证规则（核心接口，业务调用入口）
 * @param {Object} rules - 验证规则配置
 * @param {Object} msgs - 错误返回信息
 * @param {Object} params 需要验证的参数，koa 下会自动从 ctx 中获取，其他情况需要手动传入
 * @param {Object} opts.messages 错误消息模板文件
 * @return {Object} {[argName]: errorMessage} 如果返回空对象 {}，表示全部字段验证通过
 */
Validator.prototype.validate = function validate (rules, params, ref) {
        var this$1$1 = this;
        if ( ref === void 0 ) ref = {};
        var messages = ref.messages;
        var locale = ref.locale;
        var stringEmpty = ref.stringEmpty;
        var ctx = ref.ctx;


    if (stringEmpty === undefined) { stringEmpty = this.stringEmpty; }

    var deepInspect = function (rules, params, path) {
            if ( path === void 0 ) path = '';

        var paths = path ? path.split('.') : [];
        var level = paths.length;

        var result = {}; // 已验证成功的字段（存在于 params 但没有验证的不会出现在 result 对象中）
        var errors = {}; // 返回体，如果某字段验证失败，错误信息将会记录在返回题中

        var parsedRules = this$1$1._preTreatRules(rules, params, {isDeep: level > 0, stringEmpty: stringEmpty}); // 对规则进行预处理，遍历所有规则，获取值后存储在 rule 的 value 中
        var loop = function ( argName ) {

            var rule = parsedRules[argName];
            var gather = {argName: argName, rule: rule, rules: parsedRules, ctx: ctx, path: path};

            if (isTrueEmpty$1(rule.value)) {
                if (this$1$1._isArgRequired(gather)) {
                    for (var i = 0; i < this$1$1.requiredValidNames.length; i++) {
                        if (rule[this$1$1.requiredValidNames[i]]) {
                            var validName = this$1$1.requiredValidNames[i];
                            gather.validName = validName;
                            gather.validValue = rule[validName];
                            gather.parsedValidValue = this$1$1._parseValidValue({validName: validName, rule: rule, rules: parsedRules, argName: argName, ctx: ctx}); // 解析有效值
                            break
                        }
                    }
                    errors[argName] = this$1$1._getErrorMessage(gather);
                }
                if (stringEmpty && rule.string && rule.value === '') {
                    if (errors[argName]) {
                        return
                    }
                } else {
                    return
                }
            }

            // 验证单一字段所有规则
            var deepInspectRule = function (rule, parsedRules, gather, argName) {
                    var obj;


                for (var validName in rule) {

                    if (rule.allowNull && rule.value === null) {
                        continue // 该字段允许为 null 且的确为 null 则跳过检查（字符串的 'null' 无法通过）
                    } else if (this$1$1.ignoreRuleKeys.indexOf(validName) >= 0) {
                        continue // 部分字段运行直接跳过检查
                    }

                    var fn = Rules[validName];  // 如果没有对应的检查方法，则直接抛出错误
                    if (!isFunction(fn)) { throw new Error(("\"" + validName + "\" valid method is not been configed")) }

                    gather.validName = validName;
                    gather.validValue = rule[validName];
                    if (parsedRules) { gather.parsedValidValue = this$1$1._parseValidValue({validName: validName, rule: rule, rules: parsedRules, argName: argName, ctx: ctx}); } // 有些字段需要和另一个字段进行对比的， parsedValidValue 为需要对比的有效值

                    var verified = fn(rule.value, gather); // 进行验证, 返回 false string object 都算失败，返回 undefined null true 等为成功

                    if (verified === false || typeof verified === 'string') {
                        return ( obj = {}, obj[argName] = this$1$1._getErrorMessage(gather, {messages: messages, locale: locale, errType: verified}), obj ) // 获取失败信息
                    } else if (isObject$1(verified)) {
                        return verified
                    }

                    // 检查深度对象
                    if (rule.object && rule.value && isObject$1(rule.children)) {
                        var nextPath = "" + path + (path ? '.' : '') + argName;
                        var res = deepInspect(rule.children, rule.value, nextPath);
                        if (!res.err) {
                            rule.value = res.result;
                        } else {
                            var errors = {};
                            Object.keys(res.errors).forEach(function (key) {
                                errors[(argName + "." + key)] = res.errors[key];
                            });
                            return errors
                        }
                    } else if (rule.int || rule.float || rule.numeric) {
                        // 把已经成功验证的 int 与 float 进行转化
                        rule.value = parseFloat(rule.value);
                    }
                }
            };

            var ruleErrors = deepInspectRule(rule, parsedRules, gather, argName);
            if (!ruleErrors || Object.keys(ruleErrors).length === 0) {
                if (isObject$1(rule.children) && rule.value && rule.array) {
                    if (rule.array) {
                        var subValidPass = true;
                        var values = [];
                        var loop$1 = function ( index ) {
                            var item = rule.value[index];
                            var nextPath = "" + path + (path ? '.' : '') + argName + "." + index;
                            var parsedRule = this$1$1._preTreatRule(rule.children, item, nextPath, {stringEmpty: stringEmpty});
                            var gather$1 = {argName: nextPath, rule: parsedRule, rules: {children: parsedRule}, ctx: ctx, path: nextPath};
                            var childrenErrors = deepInspectRule(parsedRule, null, gather$1, nextPath);
                            if (childrenErrors && Object.keys(childrenErrors).length > 0) {
                                Object.keys(childrenErrors).forEach(function (key) {
                                    errors[key] = childrenErrors[key];
                                });
                                subValidPass = false;
                                return 'break'
                            }
                            values.push(parsedRule.value);
                        };

                            for (var index = 0; index < rule.value.length; index ++ ) {
                                var returned = loop$1( index );

                                if ( returned === 'break' ) break;
                            }
                        if (subValidPass) {
                            result[argName] = values;
                        }
                    }
                } else {
                    result[argName] = rule.value;
                }
            } else {
                Object.keys(ruleErrors).forEach(function (key) {
                    errors[key] = ruleErrors[key];
                });
            }
        };

            for (var argName in parsedRules) loop( argName );

        var err = Object.keys(errors).length > 0 ? 1 : 0;
        return {err: err, result: result, errors: errors}
    };

    return deepInspect(rules, params)
};
Validator.prototype.checkup = function checkup () {
        var ref;

    return (ref = this).validate.apply(ref, arguments)
};

// 声明静态属性
Validator.Messages = Messages;
Validator.Rules = Rules;

var index = {
    version: '0.2.2',
    Validator: Validator,
    Messages: Messages,
    Rules: Rules
};

export { Messages, Rules, Validator, index as default };
