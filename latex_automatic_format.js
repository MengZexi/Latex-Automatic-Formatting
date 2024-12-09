// ==UserScript==
// @name         Latex_Automatic Formatting
// @namespace    http://tampermonkey.net/
// @version      v0.34
// @description  Typesetting the contents of the clipboard
// @author       Mozikiy
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://www.latex-project.org/favicon.ico
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 监听鼠标松开事件
    document.addEventListener('mouseup', () => {
        // 获取选中的文本
        const selectedText = window.getSelection().toString();
        if (selectedText.trim()) {
            // 如果存在选中的文本，输出到控制台
            console.log('选中的文本:', selectedText);
        }
    });

    // 可选：在调试过程中加入提示
    console.log('Latex_Automatic Formatting脚本已加载，正在监听文本选中事件...');
})();

