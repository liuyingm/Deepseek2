// 主题对应的系统提示语
const themePrompts = {
    solution: "你是一个专业的方案撰写助手，擅长帮助用户规划和撰写各类方案。请根据用户的需求，提供专业、系统的建议和具体的实施步骤。回答时，先进行需求分析，然后给出详细的方案建议。",
    tech: "你是一个专业的AI技术顾问，擅长解答各类技术问题和提供技术建议。请根据用户的问题，提供准确、专业的技术解答。回答时，先分析问题的关键点，然后给出详细的解决方案。",
    xiaohongshu: "你是一个专业的小红书内容创作助手，擅长创作吸引人的种草文案。请根据用户的主题，创作富有感染力的内容。回答时，先分析内容定位，然后给出吸引人的文案建议。",
    coach: "你是一个专业的发展教练，擅长帮助用户探索个人潜能、制定发展目标和规划职业生涯。请根据用户的情况，运用教练技术提供有效的引导和支持。回答时，先倾听需求，然后通过提问和反馈帮助用户获得洞见。",
    story: "你是一个富有创意的故事叙述家，擅长讲述引人入胜的故事。请根据用户的需求，创作或改编有趣的故事。回答时，先构思故事框架，然后展开生动的叙述。"
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
    } else if (isUser) {
        messageDiv.textContent = content;
    } else {
        // 分离推理过程和结果
        const parts = content.split('\n');
        const reasoning = parts.slice(0, -1).join('\n');
        const result = parts[parts.length - 1];

        // 创建推理过程元素
        const reasoningDiv = document.createElement('div');
        reasoningDiv.className = 'reasoning';
        reasoningDiv.textContent = reasoning;

        // 创建结果元素
        const resultDiv = document.createElement('div');
        resultDiv.textContent = result;

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
    if (confirm('确定要清除所有聊天历史记录吗？')) {
        themeHistories = {};
        Object.keys(themePrompts).forEach(theme => {
            themeHistories[theme] = [];
        });
        chatHistory = [];
        localStorage.setItem('themeHistories', JSON.stringify(themeHistories));
        chatMessages.innerHTML = '';
        addMessage('聊天历史已清除', false);
    }
});

// 主题切换
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const newTheme = button.dataset.theme;
        if (newTheme !== currentTheme) {
            currentTheme = newTheme;
            // 保存当前主题
            localStorage.setItem('currentTheme', currentTheme);
            // 切换到对应主题的聊天历史
            chatHistory = themeHistories[currentTheme] || [];
            // 清空并重新显示消息
            chatMessages.innerHTML = '';
            if (chatHistory.length > 0) {
                restoreMessages();
            }
            // 添加主题切换提示
            addMessage(`已切换到${button.textContent}主题`, false);
        }
    });
});

// 页面加载时恢复当前主题的历史消息或显示欢迎消息
if (chatHistory.length > 0) {
    restoreMessages();
} else {
    addMessage('欢迎使用AI智能对话助手！我可以帮您撰写方案、解答技术问题、创作小红书文案或讲述有趣的故事。请选择一个主题开始对话。', false);
}