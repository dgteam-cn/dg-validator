[新增] int 和 float 增加 multiple 字段，验证是否为某值的倍数
1、架构改变使用 rollup.js 进行开发
2、调整了参数获取方式，取消了 ctx 模式
3、调整了顶级 api、调整了验证逻辑
4、增加了对象、数组的 children 验证，增加 allowNull 的规则
5、调整国际化（多语言）方案

## 0.1.0
    [新增] allowNull 字段，允许 null 值，仅 json 格式支持，仅拥有 ctx 后端支持
    [新增] placeholder 字段在免检字段中
    
## 0.0.7
    调整 array 方法的验证不规范,和错误提示    
    [新增] test 测试文件

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