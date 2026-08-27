# C 语言学习 · 从入门到精通

一个帮助你从零基础系统学习 C 语言的免费静态网站：在线写代码、编译运行、自动判题、章节训练与进度记录。手机、电脑浏览器都能用。

## 在线地址

https://renyuq1.github.io/c-learn/

## 课程大纲（8 章 · 42 小节）

1. **程序设计基础** —— 程序、算法、开发环境、Hello World、编译运行过程
2. **C 语言基础知识** —— 数据类型、变量、常量、运算符、类型转换、输入输出
3. **程序控制结构** —— if / switch / for / while、break、continue、循环嵌套
4. **数组** —— 一维/二维数组、字符串、字符串函数、排序与查找
5. **函数** —— 定义与调用、参数与返回值、递归、作用域、常用库函数
6. **指针** —— 指针概念、指针与数组/字符串/函数、多级指针与指针数组
7. **用指针和结构体处理链表** —— 结构体、typedef/共用体/枚举、动态内存、链表
8. **文件操作** —— fopen/fclose、顺序读写、格式化与二进制读写、随机读写

每章都配有：**讲解 + 示例代码 + 训练题**（选择题 / 填空题 / 编程题，均带答案与解析）。

## 技术栈

- 纯 HTML / CSS / JavaScript 单页应用（hash 路由），无构建、无框架。
- 代码编辑器：[CodeMirror 5](https://codemirror.net/)（`clike` 模式，C 语言高亮）。
- 在线编译运行：[Wandbox API](https://wandbox.org/)（编译器 `gcc-13.2.0-c`），需联网。
- 学习进度：`localStorage` 本地保存（键 `c-learn-progress-v1`），无需登录。

## 本地运行

直接用浏览器打开 `index.html` 即可（在线编译功能需要联网）。

或启动一个本地静态服务器：

```bash
# 任意一种即可
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 目录结构

```
c-learn/
├── index.html               # 页面骨架
├── css/
│   └── style.css            # 样式
├── js/
│   ├── app.js               # 路由 / 渲染 / 运行 / 判题 / 进度
│   └── content/
│       ├── content.js       # 数据格式说明 + COURSE 容器
│       ├── ch1.js … ch8.js  # 8 章课程内容
└── README.md
```

## 更新与部署

内容都在 `js/content/ch*.js` 里，改完文件后提交并推送即可，GitHub Pages 约 1 分钟自动更新：

```bash
git add -A && git commit -m "更新内容" && git push
```
