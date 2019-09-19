# 晚安式自动提醒

## 配置方法

* 重命名`config-example.json`文件为`config.json`
* 配置程序
* 运行命令`npm run start`

## `config.json`配置项

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| selfId      | number | 机器人QQ号 |
| port        | number | httpapi的socket端口号 |
| groupNumber | number | 群号      |
| userId      | Array&lt;number&gt; | 触发命令的qq号 |
| cron        | string | 定时器配置 |