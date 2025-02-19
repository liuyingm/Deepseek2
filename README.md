# AI智能对话助手

## 项目介绍
这是一个基于Web的智能对话助手系统，能够根据不同主题提供专业的对话服务。系统支持多种对话主题，包括方案撰写、技术咨询、小红书创作、职业发展指导和故事创作等。

## 功能特点
- 多主题切换：支持在不同对话主题间自由切换
- 历史记录：自动保存各主题的对话历史
- 实时响应：流畅的对话体验，支持实时显示AI思考状态
- 界面美观：简洁直观的用户界面设计
- 主题排序：优化主题切换体验
- 导出功能：支持对话历史导出

## 主题类型
1. 方案撰写：帮助用户规划和撰写各类方案
2. 技术顾问：解答技术问题，提供专业建议
3. 小红书创作：协助创作吸引人的种草文案
4. 发展教练：帮助探索个人潜能，规划职业发展
5. 故事叙述：创作或改编有趣的故事

## 技术实现
- 前端：原生JavaScript、HTML5、CSS3
- 后端：Node.js
- API：Deepseek API
- 数据存储：LocalStorage

## 部署步骤
1. 安装依赖
```bash
npm install
```

2. 配置API密钥
在server.js中配置您的API密钥：
```javascript
const API_KEY = 'your-api-key';
```

3. 启动服务器
```bash
node server.js
```

4. 访问应用
打开浏览器访问：http://localhost:3000

## 使用说明
1. 选择对话主题：点击左侧主题按钮切换不同的对话场景
2. 输入内容：在底部输入框中输入您想咨询的内容
3. 发送消息：点击发送按钮或按Enter键发送消息
4. 查看历史：对话历史会自动保存，切换主题时可查看对应历史记录
5. 清除历史：点击「清除历史记录」按钮可清除所有对话历史

## 版本信息
- 当前版本：0.3
- 更新日期：2024-01-26

## 注意事项
- 请确保API密钥配置正确
- 建议使用现代浏览器访问以获得最佳体验
- 对话历史存储在本地，清除浏览器数据会导致历史记录丢失

## 开发计划
- [ ] 添加更多专业领域的对话主题
- [ ] 支持对话历史导出功能
- [ ] 优化AI响应速度
- [ ] 添加用户自定义主题功能
