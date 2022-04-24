# 非严格模式下数组兼容、转换预期

### 目标类型
string; int; float; boolean; array; object;

### javascript 数据类型
number; string; boolean; function; null; undefined;   
ES6: symbol; bigint;   
Object: object; array;   

### 特殊数据类型解释
| 原始类型 | 备注说明 |
| ------ | ------ |
| undefined | 解释为没有传递参数 |
| null      | 由于在 mysql 与 json 中都有特定含义，null 某种意义上属于有效参数，可通过 allowNull 进行配置 |
| ""        | 在 string 中解释为空字符串，在 array 中解释为空数组，其他都以 undefined 处理 |
| NaN       | 以 undefined 处理 |

### 空字符串处理
| 原始类型 | 目标类型 | 兼容方式 | 备注说明 |
| ------ | ------ | ------ | ------ |
|emptyString | string  | 可兼容 | 不进行转义 |
|emptyString | number  | 不兼容 | 转义为 undefined |
|emptyString | boolean | 不兼容 | 转义为 undefined |
|emptyString | array   | 不兼容 | 转义为 [] (此处可能会有异议，需要之后出配置进行定制) |
|emptyString | object  | 不兼容 | 转义为 undefined |

### 转义为字符串

| 原始类型 | 目标类型 | 兼容方式 | 备注说明 |
| ------ | ------ | ------ | ------ |
| number   | string | 可兼容 | 使用 toString 方法转化 |
| boolean  | string | 可兼容 | 使用 toString 方法转化 |
| array    | string | 有争议 | 使用 toString 方法转化（或 JSON.stringify 序列化）|
| object   | string | 有争议 | 使用 toString 方法转化（或 JSON.stringify 序列化）|

### 转义为数字
| 原始类型 | 目标类型 | 兼容方式 | 备注说明 |
| ------ | ------ | ------ | ------ |
| string   | number | 半兼容 | 使用字符串格式进行验证，若验证成功后再使用 parseFloat 进行转换 |
| boolean  | number | 不兼容 | |
| array    | number | 不兼容 | |
| object   | number | 不兼容 | |

### 转义为布尔值
| 原始类型 | 目标类型 | 兼容方式 | 备注说明 |
| ------ | ------ | ------ | ------ |
| string   | boolean | 半兼容 | ['0', '1', 'true', 'false', 'TRUE', 'FALSE'] 等可自动转换，其他不兼容（之后考虑更多配置兼容 ['yes', 'y', 'no', 'n']]）  |
| number   | boolean | 半兼容 | [0, 1] 等可自动转换，其他不兼容 |
| array    | boolean | 不兼容 | |
| object   | boolean | 不兼容 | |

### 转义为数组
| 原始类型 | 目标类型 | 兼容方式 | 备注说明 |
| ------ | ------ | ------ | ------ |
| string   | array | 可兼容 | 尝试 JSON.parse 进行解析，若解析失败且为字符串再尝试使用 split 进行分裂（之后会出更多配置进行规则定制） |
| number   | array | 不兼容 | |
| boolean  | array | 不兼容 | |
| object   | array | 不兼容 | |

### 转义为对象
| 原始类型 | 目标类型 | 兼容方式 | 备注说明 |
| ------ | ------ | ------ | ------ |
| string   | object | 可兼容 | 尝试 JSON.parse 进行解析，若解析失败则验证失败 |
| number   | object | 不兼容 | |
| boolean  | object | 不兼容 | |
| array    | object | 不兼容 | |

### 特殊

| 原始类型 | 目标类型 | 兼容方式 | 说明 |
| ------ | ------ | ------ | ------ |
| function | string | 有争议 | 使用 toString 方法转化（或转移为 "[object Function]"）|
| symbol   | string | 可兼容 | 使用 toString 方法转化 |
| bigint   | string | 可兼容 | 使用 toString 方法转化 |