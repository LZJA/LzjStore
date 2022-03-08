
### 代码片段格式
```
"Print to console": {
  "scope": "javascript,typescript",
  "prefix": "log",
  "body": [
   "console.log('$1');",
   "$2"
  ],
  "description": "Log output to console"
}
```

### 字段说明
- `Print to console` 代码片段名称
- `scope` 使用的语言范围
- `prefix` 触发当前的 snippt 片段
- `body` 代码片段的具体内容
- `description` 代码片段的描述

### 书写技巧
- `$1`表示初始位置，`$2`表示按下tab将会跳转到该位置，`$3`以此类推
- 设置默认值，`${1: default value}`
- 设置可选项，`${1|one,two,three|}`
- 防止转译，双引号需要加斜杠 `\"`，`$` 需要加两个斜杠 `\\$`
- `prefix`可以接收数组，定义多个关键字（根据每个人的习惯私人订制）

### 代码片段制作地址
[snippet generator](https://snippet-generator.app/)