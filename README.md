# Dify Knowledge Base Importer

一个用于便捷导入内容到 Dify Workflow 的 Chrome 扩展。支持多种输入方式，可以轻松地将网页内容、文本或文件导入到指定的 Dify Workflow 中进行后续处理。注意，该插件并不能安装后马上使用，需要搭配你自己所配置的 dify workflow，需要一定的动手能力（但都是基于 dify 的图形化编程）。

Demo 视频：
![Demo 视频](https://www.bilibili.com/video/BV1sgKGejEaT)

## 功能特点

### 1. 多样化的输入方式

- **快速导入**
  - 一键导入当前浏览的网页
  - 自动获取网页标题和URL
  - 适合快速保存感兴趣的网页内容

- **手动输入**
  - 支持多种内容类型：
    - 文本类：Plain Text、Markdown
    - 代码类：Python、JavaScript、Java、C++、Go、Ruby、PHP、Swift、Rust、SQL
    - 数据类：JSON、YAML、XML、CSV
  - 可自定义标题
  - 灵活的内容编辑

- **文件上传**
  - 支持文本文件上传
  - 自动使用文件名作为标题
  - 适合批量导入本地文档

### 2. 灵活的配置选项

- 可配置 API URL
- 支持自定义 API Key
- 设置持久化存储

### 3. 实时反馈

- 清晰的状态提示
- 详细的响应日志
- 操作结果即时展示

## 典型应用场景

### 网页内容采集和知识库构建

1. 使用 Firecrawl 进行网页抓取
2. 通过 LLM 进行信息提取和总结
3. 使用本插件将处理后的内容以 Markdown 格式导入
4. 内容自动进入 Dify Knowledge Base
5. 其他 Dify Agent 可直接使用导入的知识

## 使用指南

### 安装配置

1. 在 Chrome 中安装扩展
2. 点击扩展图标，打开设置面板
3. 配置 API URL 和 API Key
4. 保存设置

### 使用方法

#### 方式一：导入当前网页
1. 浏览到目标网页
2. 点击扩展图标
3. 点击"Import Current Page"按钮

#### 方式二：手动输入内容
1. 点击扩展图标
2. 选择内容类型
3. 输入标题（可选）和内容
4. 点击"Submit Content"按钮

#### 方式三：上传文件
1. 点击扩展图标
2. 点击"Choose File"选择文件
3. 点击"Upload File"按钮

### 注意事项

- 确保 API Key 配置正确
- 检查 API URL 可访问性
- 大文件上传可能需要等待较长时间
- 建议定期查看响应日志以确保导入成功

## 版本历史

### v1.1
- 优化用户界面
- 添加更多文件类型支持
- 改进错误处理
- 优化响应日志显示

### v1.0
- 初始版本发布
- 基础功能实现

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

[MIT License](LICENSE) 