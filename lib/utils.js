const config = require('../config.json');

/**
 * 提取晚安式话题
 * @param { string } content: 信息
 */
exports.getTopicName = function getTopicName(content) {
  const result = content.match(/(?:#).+(?:#)/g);

  return result[0].substr(1, result[0].length - 2);
};

/**
 * 判断是否符合规则
 * @param { object } dataJson: 消息
 */
exports.inGroup = function inGroup(dataJson) {
  return dataJson.group_id === config.groupNumber // 群号一致
    && dataJson.self_id === config.selfId         // qq号
    && dataJson.message_type === 'group';         // 是群消息
};