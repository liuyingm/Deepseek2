// 配置文件，从环境变量中读取敏感信息
require('dotenv').config();

module.exports = {
    API_KEY: process.env.API_KEY,
    API_URL: process.env.API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
};