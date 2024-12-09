// ==UserScript==
// @name         Latex_Automatic Formatting
// @namespace    http://tampermonkey.net/
// @version      v0.40
// @description  Typesetting the contents of the clipboard
// @author       Mozikiy
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://www.latex-project.org/favicon.ico
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建右键菜单的容器
    const createMenu = (text, x, y) => {
        // 如果菜单已存在，先移除
        const existingMenu = document.getElementById('custom-context-menu');
        if (existingMenu) existingMenu.remove();

        // 创建菜单容器
        const menu = document.createElement('div');
        menu.id = 'custom-context-menu';
        menu.style.position = 'absolute';
        menu.style.top = `${y}px`;
        menu.style.left = `${x}px`;
        menu.style.background = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.3)';
        menu.style.padding = '10px';
        menu.style.zIndex = '9999';
        menu.style.fontSize = '14px';

        // 定义菜单选项
        const options = [
            { label: '1. copy(text)', action: () => copyToClipboard(text) },
            { label: '2. copy(fill)', action: () => copyToClipboard(`Filled: ${text}`) },
            { label: '3. add$', action: () => copyToClipboard(`$${text}$`) },
            { label: '4. sub$', action: () => copyToClipboard(`\\(${text}\\)`) },
            { label: '5. $to$$', action: () => copyToClipboard(text.replace(/\$/g, '$$')) },
            { label: '6. formula', action: () => copyToClipboard(`Formula: $$${text}$$`) },
        ];

        // 动态添加菜单选项
        options.forEach(opt => {
            const item = document.createElement('div');
            item.innerText = opt.label;
            item.style.padding = '5px';
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                opt.action();
                menu.remove();
            });
            menu.appendChild(item);
        });

        // 点击其他地方时关闭菜单
        document.addEventListener('click', () => menu.remove(), { once: true });

        // 将菜单添加到文档中
        document.body.appendChild(menu);
    };

    // 将文本复制到剪贴板
    const copyToClipboard = text => {
        navigator.clipboard.writeText(text).then(() => {
            console.log(`Copied to clipboard: ${text}`);
        });
    };

    // 监听鼠标松开事件
    document.addEventListener('mouseup', event => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // 在鼠标位置显示菜单
            createMenu(selectedText, event.pageX, event.pageY);
        }
    });

    // 日志提示脚本已加载
    console.log('Latex_Automatic Formatting 脚本已加载，正在监听文本选中事件...');
})();

