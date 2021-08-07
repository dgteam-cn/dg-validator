## 0.0.6
如果是空参数（空字符串），在 rule.string = true 规则成立时会设置为 '', 其他情况下会以 undefined 处理
在 int float 等与 length 混用时，若验证失败应该返回更为精确的错误信息
    - 以增加规则，但是需要修改字符串

## 0.0.5
增加 - dateRange
增加 - datetimeRange

## 0.0.4
调整 - 调整 date 的规则
新增 - 新增 time 的规则
新增 - 新增 datetime 的规则

## 0.0.3
修复 array 方式验证引发的错误

## 0.0.2
修复 regexp 方式验证引发的错误

## 0.0.1
表单验证插件，支持前端、后端（koa体系）验证

// TODO children 验证方式无效
// TODO array 不支持 , 隔开的字符串格式