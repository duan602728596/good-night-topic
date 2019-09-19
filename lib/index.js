const WebSocket = require('ws');
const schedule = require('node-schedule');
const moment = require('moment');
const config = require('../config.json');
const { getTopicName, inGroup } = require('./utils');

/* 初始化socket */
const eventIo = new WebSocket(`ws://127.0.0.1:${ config.port }/event`);
const apiIo = new WebSocket(`ws://127.0.0.1:${ config.port }/api`);

/* 缓存信息 */
const cacheInfo = {
  topic: undefined, // 话题
  time: undefined   // 时间
};

/* 监听群信息的回调函数 */
function handleWsMessage(data) {
  const dataJson = JSON.parse(data);

  if (!inGroup(dataJson)) return; // 判断是否符合规则

  if (!config.userId.includes(dataJson.user_id)) return; // 判断说话的人在配置里

  // 群消息
  const content = dataJson.raw_message ? dataJson.raw_message : dataJson.message;

  // 晚安式话题截止
  if (content === '晚安式截止') {
    cacheInfo.topic = undefined;
    cacheInfo.time = undefined;

    return;
  }

  // 判断是否为晚安式命令格式，example：[CQ:at,qq=all] 晚安式#话题#10:00截止
  if (!/晚安式#.+#[0-9]+:[0-9]+截止/.test(content)) return;

  // 提取晚安式话题，并缓存信息
  cacheInfo.topic = getTopicName(content);
  cacheInfo.time = moment();
}

/* 定时任务 */
function timedTask() {
  if (!cacheInfo.topic) return; // 没有晚安话题
  if (!cacheInfo.time) return;  // 没有缓存时间
  if (!moment().isSame(cacheInfo.time, 'day')) return; // 判断是否为一天

  apiIo.send(JSON.stringify({
    action: 'send_group_msg',
    params: {
      group_id: config.groupNumber,
      message: `捞一下晚安式：#${ cacheInfo.topic }#`
    }
  }));
}

/* 监听群信息 */
eventIo.on('message', handleWsMessage);

/* 定时器 */
schedule.scheduleJob(config.cron, timedTask);