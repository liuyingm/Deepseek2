// 主题对应的系统提示语
const themePrompts = {
    solution: "你是一位资深的方案策划专家，拥有丰富的项目管理和战略规划经验。专长领域包括：商业计划书、营销方案、项目实施方案、活动策划等。在回答时，你会遵循以下步骤：\n1. 需求分析：深入理解用户目标、约束条件和关键利益相关者\n2. 市场洞察：结合行业趋势和最佳实践进行分析\n3. 方案设计：提供详细的执行计划，包括时间线、资源分配和风险管理\n4. KPI设定：制定清晰的成功指标和评估方法\n请以专业、系统化的方式提供建议，确保方案的可行性和实用性。",
    tech: "你是一位全栈技术专家，精通前后端开发、系统架构、云计算、人工智能等领域。你的回答将遵循以下框架：\n1. 问题诊断：准确识别技术难点和潜在风险\n2. 解决方案：提供多个可行的技术路径，并进行优劣对比\n3. 最佳实践：分享相关的设计模式、架构原则和性能优化建议\n4. 实施指导：提供详细的代码示例或配置步骤\n请用专业且易懂的方式解释技术概念，帮助用户做出最佳技术决策。",
    xiaohongshu: "你是一位深谙小红书运营的内容策划专家，精通种草文案创作和用户心理。你的创作方法论包括：\n1. 内容定位：结合平台算法和用户画像进行选题\n2. 标题创作：运用高转化率的标题公式和热门话题\n3. 文案结构：采用'AARRR'模型（吸引-激活-留存-转化-分享）\n4. 视觉规划：提供图文排版建议和关键视觉元素建议\n请创作真实、有温度、易传播的内容，注重用户价值和互动性。",
    coach: "你是一位ICF认证的职业发展教练，擅长运用GROW模型和NLP技术进行个人成长辅导。你的辅导方法包括：\n1. 建立信任：创造安全的对话空间，建立良好的教练关系\n2. 目标设定：运用SMART原则，明确发展愿景\n3. 现状分析：探索内在动力和外部资源\n4. 行动计划：设计具体可行的成长路径\n请通过有效提问和积极倾听，激发用户的自我觉察和行动力。",
    story: "你是一位专业的故事创作大师，精通故事架构设计和叙事技巧。你的创作方法论包括：\n1. 人物塑造：设计立体的角色形象和成长弧光\n2. 情节构建：运用'英雄之旅'等经典故事结构\n3. 场景描写：通过感官细节营造沉浸式体验\n4. 主题升华：巧妙植入核心价值观和情感共鸣点\n请创作富有想象力且引人入胜的故事，注重情节逻辑和情感表达。",
    research: "你是一位经验丰富的学术研究顾问，熟悉各类研究方法论和学术规范。你的指导方法包括：\n1. 文献梳理：运用系统性文献综述方法，识别研究空白\n2. 研究设计：制定严谨的实验/调研方案，确保研究效度\n3. 数据分析：选择合适的统计方法，确保结果可靠性\n4. 论文写作：遵循学术规范，突出研究创新点和贡献\n请以严谨的学术态度提供建议，确保研究的科学性和创新性。",
    translator: "你是一位专业的多语言翻译专家，精通跨文化交际和语言本地化。你的翻译方法论包括：\n1. 语境分析：深入理解源语言的文化背景和表达意图\n2. 翻译策略：灵活运用直译、意译等多种翻译技巧\n3. 本地化处理：考虑目标语言的文化习惯和表达特点\n4. 专业校对：确保术语准确性和表达地道性\n请提供准确、流畅、富有文化韵味的翻译，并适时提供语言学习建议。"
};

// 从localStorage恢复聊天历史和当前主题
let themeHistories = JSON.parse(localStorage.getItem('themeHistories') || '{}');
let currentTheme = localStorage.getItem('currentTheme') || 'solution';

// 确保每个主题都有一个空的历史记录数组
Object.keys(themePrompts).forEach(theme => {
    if (!themeHistories[theme]) {
        themeHistories[theme] = [];
    }
});

// 获取当前主题的聊天历史
let chatHistory = themeHistories[currentTheme] || [];

// 恢复历史消息到界面
function restoreMessages() {
    for (let i = 0; i < chatHistory.length; i += 2) {
        const userMessage = chatHistory[i];
        const botMessage = chatHistory[i + 1];
        if (userMessage) addMessage(userMessage.content, true);
        if (botMessage) addMessage(botMessage.content, false);
    }
}


// 初始化页面元素
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const themeButtons = document.querySelectorAll('.theme-button');

// 添加消息到聊天界面
function addMessage(content, isUser = false, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    if (isLoading) {
        messageDiv.innerHTML = '<div class="loading">AI正在思考中<span class="dots">...</span></div>';
    } else {
        // 添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.onclick = async () => {
            try {
                await navigator.clipboard.writeText(content);
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.classList.add('copied');
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
            }
        };
        messageDiv.appendChild(copyButton);
    }
    
    if (isUser) {
        messageDiv.textContent = content;
        // 为用户消息重新添加复制按钮（因为textContent会清除之前添加的按钮）
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.onclick = async () => {
            try {
                await navigator.clipboard.writeText(content);
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.classList.add('copied');
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
            }
        };
        messageDiv.appendChild(copyButton);
    } else if (!isLoading) {
        // 分离推理过程和结果
        const parts = content.split('\n');
        const reasoning = parts.slice(0, -1).join('\n');
        const result = parts[parts.length - 1];

        // 创建推理过程元素
        const reasoningDiv = document.createElement('div');
        reasoningDiv.className = 'reasoning';
        reasoningDiv.style.letterSpacing = '0.5px';
        reasoningDiv.style.lineHeight = '1.6';
        reasoningDiv.style.marginBottom = '12px';

        // 创建结果元素
        const resultDiv = document.createElement('div');
        resultDiv.style.letterSpacing = '0.5px';
        resultDiv.style.lineHeight = '1.6';

        // 添加打字机效果
        const typeWriter = (element, text, index = 0) => {
            if (index < text.length) {
                element.innerHTML = marked.parse(text.substring(0, index + 1));
                setTimeout(() => typeWriter(element, text, index + 1), 20);
            }
        };

        // 检查是否为历史消息（通过chatHistory长度判断）
        const isHistoryMessage = chatHistory.length > 0 && 
            chatHistory.some(msg => msg.role === 'assistant' && msg.content === content);

        if (isHistoryMessage) {
            // 历史消息直接显示
            const paragraphs = reasoning.split('\n').filter(p => p.trim());
            paragraphs.forEach(paragraph => {
                const p = document.createElement('p');
                p.style.margin = '8px 0';
                p.innerHTML = marked.parse(paragraph);
                reasoningDiv.appendChild(p);
            });
            resultDiv.innerHTML = marked.parse(result);
        } else {
            // 新消息使用打字机效果
            const paragraphs = reasoning.split('\n').filter(p => p.trim());
            paragraphs.forEach((paragraph, i) => {
                const p = document.createElement('p');
                p.style.margin = '8px 0';
                reasoningDiv.appendChild(p);
                setTimeout(() => typeWriter(p, paragraph), i * 1000);
            });
            setTimeout(() => typeWriter(resultDiv, result), paragraphs.length * 1000);
        }

        messageDiv.appendChild(reasoningDiv);
        messageDiv.appendChild(resultDiv);
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// 发送消息到服务器
async function sendMessage(message) {
    const loadingMessage = addMessage('', false, true);
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: themePrompts[currentTheme] },
                    ...chatHistory,
                    { role: 'user', content: message }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.choices[0].message.content;

        // 更新当前主题的聊天历史
        chatHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: botResponse }
        );
        themeHistories[currentTheme] = chatHistory;

        // 保存所有主题的聊天历史到localStorage
        localStorage.setItem('themeHistories', JSON.stringify(themeHistories));

        // 移除加载消息并添加响应
        loadingMessage.remove();
        addMessage(botResponse);
    } catch (error) {
        console.error('Error:', error);
        loadingMessage.remove();
        addMessage('抱歉，服务器响应出错，请稍后重试。', false);
    }
}

// 事件监听器
sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        sendMessage(message);
        userInput.value = '';
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendButton.click();
    }
});

// 清除历史记录
document.getElementById('clear-history').addEventListener('click', () => {
    if (confirm(`确定要清除当前主题「${currentTheme}」的历史记录吗？`)) {
        themeHistories[currentTheme] = [];
        chatHistory = [];
        localStorage.setItem('themeHistories', JSON.stringify(themeHistories));
        document.getElementById('chat-messages').innerHTML = '';
        const notice = document.getElementById('theme-switch-notice');
        notice.textContent = '当前主题的历史记录已清除';
        notice.classList.add('show');
        setTimeout(() => {
            notice.classList.remove('show');
        }, 2000);
    }
});

// 主题切换
// 更新主题按钮状态
function updateThemeButtons() {
    themeButtons.forEach(button => {
        if (button.dataset.theme === currentTheme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// 主题使用时间记录
let themeUsageTime = JSON.parse(localStorage.getItem('themeUsageTime') || '{}');

// 初始化每个主题的使用时间
Object.keys(themePrompts).forEach(theme => {
    if (!themeUsageTime[theme]) {
        themeUsageTime[theme] = Date.now();
    }
});

// 更新主题按钮顺序
function updateThemeOrder() {
    const themeButtonsContainer = document.querySelector('.theme-buttons-container');
    const themeButtonsArray = Array.from(document.querySelectorAll('.theme-button'));
    
    // 根据最后使用时间排序
    themeButtonsArray.sort((a, b) => {
        const themeA = a.dataset.theme;
        const themeB = b.dataset.theme;
        return themeUsageTime[themeB] - themeUsageTime[themeA];
    });
    
    // 重新排序按钮
    themeButtonsArray.forEach(button => {
        themeButtonsContainer.appendChild(button);
    });
}

// 初始化时设置当前主题按钮状态和排序
updateThemeButtons();
updateThemeOrder();

themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const newTheme = button.dataset.theme;
        if (newTheme !== currentTheme) {
            currentTheme = newTheme;
            // 更新主题使用时间
            themeUsageTime[newTheme] = Date.now();
            localStorage.setItem('themeUsageTime', JSON.stringify(themeUsageTime));
            // 更新主题排序
            updateThemeOrder();
            // 保存当前主题
            localStorage.setItem('currentTheme', currentTheme);
            // 更新主题按钮状态
            updateThemeButtons();
            // 切换到对应主题的聊天历史
            chatHistory = themeHistories[currentTheme] || [];
            // 清空并重新显示消息
            chatMessages.innerHTML = '';
            if (chatHistory.length > 0) {
                restoreMessages();
            }
            // 显示主题切换提示
            const notice = document.getElementById('theme-switch-notice');
            notice.textContent = `已切换到${button.textContent}主题`;
            notice.classList.add('show');
            setTimeout(() => {
                notice.classList.remove('show');
            }, 2000);
        }
    });
});

// 页面加载时恢复当前主题的历史消息或显示欢迎消息
if (chatHistory.length > 0) {
    restoreMessages();
} else {
    addMessage('欢迎使用AI智能对话助手！我可以帮您撰写方案、解答技术问题、创作小红书文案或讲述有趣的故事。请选择一个主题开始对话。', false);
}
// 导出历史记录
document.getElementById('export-history').addEventListener('click', () => {
    // 准备导出数据
    const exportData = {
        currentTheme,
        timestamp: new Date().toLocaleString(),
        histories: {}
    };

    // 获取当前主题的历史记录
    const currentHistory = themeHistories[currentTheme] || [];
    exportData.histories[currentTheme] = formatChatHistory(currentHistory);

    // 创建格式化的文本内容
    const textContent = generateExportText(exportData);

    // 创建Blob对象
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_history_${currentTheme}_${new Date().toISOString().slice(0,10)}.txt`;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});

// 格式化聊天历史记录
function formatChatHistory(history) {
    return history.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date().toLocaleString()
    }));
}

// 生成导出文本
function generateExportText(data) {
    let text = `聊天记录导出
导出时间：${data.timestamp}
主题：${data.currentTheme}

`;

    const history = data.histories[data.currentTheme];
    if (history && history.length > 0) {
        history.forEach((msg, index) => {
            text += `${msg.role === 'user' ? '用户' : 'AI'}：${msg.content}\n\n`;
        });
    } else {
        text += '暂无聊天记录\n';
    }

    return text;
}