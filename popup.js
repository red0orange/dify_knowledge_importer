// API 配置管理
const ApiConfig = {
    DEFAULT_URL: 'http://123.249.40.236/v1/workflows/run',
    
    async load() {
        const result = await chrome.storage.local.get(['difyApiKey', 'difyApiUrl']);
        return {
            apiKey: result.difyApiKey || '',
            apiUrl: result.difyApiUrl || this.DEFAULT_URL
        };
    },
    
    async save(apiKey, apiUrl) {
        await chrome.storage.local.set({
            difyApiKey: apiKey,
            difyApiUrl: apiUrl || this.DEFAULT_URL
        });
    },
    
    async clear() {
        await chrome.storage.local.clear();
    }
};

// UI 管理
const UI = {
    elements: {},
    
    initialize() {
        // 缓存 DOM 元素
        this.elements = {
            apiKey: document.getElementById('apiKey'),
            apiUrl: document.getElementById('apiUrl'),
            title: document.getElementById('title'),
            content: document.getElementById('content'),
            contentType: document.getElementById('contentType'),
            fileInput: document.getElementById('fileInput'),
            responseLog: document.getElementById('responseLog'),
            status: document.getElementById('status')
        };
        
        // 初始化折叠面板
        this.initializeCollapsible();
    },
    
    initializeCollapsible() {
        document.querySelectorAll('.collapsible-header').forEach(header => {
            header.addEventListener('click', () => {
                const targetId = header.getAttribute('data-target');
                const content = document.getElementById(targetId);
                const arrow = header.querySelector('.arrow');
                
                content.classList.toggle('hidden');
                arrow.classList.toggle('rotated');
            });
        });
    },
    
    showStatus(message, type = 'success') {
        this.elements.status.textContent = message;
        this.elements.status.className = `status ${type}`;
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                this.elements.status.textContent = '';
                this.elements.status.className = 'status';
            }, 3000);
        }
    },
    
    appendToLog(message) {
        this.elements.responseLog.textContent += message + '\n';
        this.elements.responseLog.scrollTop = this.elements.responseLog.scrollHeight;
    },
    
    clearLog() {
        this.elements.responseLog.textContent = '';
    }
};

// API 请求处理
const ApiService = {
    async sendRequest(data) {
        const config = await ApiConfig.load();
        if (!config.apiKey) {
            throw new Error('Please enter API Key first!');
        }

        const requestData = {
            inputs: {
                ...data,
                content: data.content || 'empty'
            },
            response_mode: "streaming",
            user: "extension_user"
        };

        UI.appendToLog(`Sending request: ${JSON.stringify(requestData, null, 2)}\n`);

        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}\nResponse: ${errorText}`);
        }

        await this.handleStreamingResponse(response);
    },

    async handleStreamingResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            UI.appendToLog(`Received: ${chunk}`);
        }
    }
};

// 事件处理
const EventHandlers = {
    async initialize() {
        // 加载保存的设置
        const config = await ApiConfig.load();
        UI.elements.apiKey.value = config.apiKey;
        UI.elements.apiUrl.value = config.apiUrl;

        // 设置相关事件
        document.getElementById('saveSettings').addEventListener('click', this.handleSaveSettings);
        document.getElementById('clearSettings').addEventListener('click', this.handleClearSettings);
        
        // 导入相关事件
        document.getElementById('importCurrentPage').addEventListener('click', this.handleImportPage);
        document.getElementById('submitContent').addEventListener('click', this.handleSubmitContent);
        document.getElementById('uploadFile').addEventListener('click', this.handleFileUpload);
        document.getElementById('clearLog').addEventListener('click', () => UI.clearLog());
    },

    async handleSaveSettings() {
        try {
            await ApiConfig.save(UI.elements.apiKey.value, UI.elements.apiUrl.value);
            UI.showStatus('Settings saved successfully!');
        } catch (error) {
            UI.showStatus(error.message, 'error');
        }
    },

    async handleClearSettings() {
        try {
            await ApiConfig.clear();
            UI.elements.apiKey.value = '';
            UI.elements.apiUrl.value = ApiConfig.DEFAULT_URL;
            UI.showStatus('Settings cleared successfully!');
        } catch (error) {
            UI.showStatus(error.message, 'error');
        }
    },

    async handleImportPage() {
        UI.showStatus('Starting import current page...', 'pending');
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => ({
                    title: document.title,
                    url: window.location.href
                })
            });

            const pageData = results[0].result;
            await ApiService.sendRequest({
                type: 'link',
                title: pageData.title,
                content: "Links no content needed !!!!!!!!",
                link: pageData.url
            });
            UI.showStatus('Content imported successfully!');
        } catch (error) {
            UI.showStatus(error.message, 'error');
        }
    },

    async handleSubmitContent() {
        UI.showStatus('Starting content submission...', 'pending');
        try {
            await ApiService.sendRequest({
                type: UI.elements.contentType.value,
                title: UI.elements.title.value || 'Untitled',
                content: UI.elements.content.value
            });
            UI.showStatus('Content submitted successfully!');
        } catch (error) {
            UI.showStatus(error.message, 'error');
        }
    },

    handleFileUpload() {
        const file = UI.elements.fileInput.files[0];
        if (!file) {
            UI.showStatus('Please select a file first!', 'error');
            return;
        }

        UI.showStatus('Starting file upload...', 'pending');
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                await ApiService.sendRequest({
                    type: "text",
                    title: file.name,
                    content: e.target.result
                });
                UI.showStatus('File uploaded successfully!');
            } catch (error) {
                UI.showStatus(error.message, 'error');
            }
        };
        reader.readAsText(file);
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', async () => {
    UI.initialize();
    await EventHandlers.initialize();
}); 