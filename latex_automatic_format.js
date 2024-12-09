// ==UserScript==
// @name         Latex_Automatic Formatting
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Typesetting the contents of the clipboard
// @author       Mozikiy
// @match        *://*
// @icon         https://www.latex-project.org/favicon.ico
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义标点转换的函数
    function convertPunctuation(text) {
        return text
            .replace(/(?<=[^a-zA-Z0-9]) /g, '$\\underline { \\hspace{1cm} }$')
            .replace(/,/g, ', ')
            .replace(/\./g, '. ')
            .replace(/，/g, ', ')
            .replace(/。/g, '. ')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/λ/g, '$\\lambda$')
            .replace(/α/g, '$\\alpha$')
            .replace(/β/g, '$\\beta$')
            .replace(/γ/g, '$\\gamma$')
            .replace(/ρ/g, '$\\rho$')
            .replace(/σ/g, '$\\sigma$')
            .replace(/δ/g, '$\\delta$')
            .replace(/φ/g, '$\\varphi$')
            .replace(/：/g, ': ')
            .replace(/⋯/g, '\\cdots')
            .replace(/x,/g, '$x$,')
            .replace(/\|/g, '\\vert')
            .replace(/（/g, '(')
            .replace(/）/g, ')')
            .replace(/［/g, '[')
            .replace(/］/g, ']')
            .replace(/C02/g, '$CO_2$')
            .replace(/H2O/g, '$H_2O$')
            .replace(/CO2/g, '$CO_2$')
            .replace(/H20/g, '$H_2O$')
            .replace(/,,/g, ', ')
            .replace(/\.\./g, '. ')
            .replace(/, ,/g, ', ')
            .replace(/\. \./g, '. ');
    }

    // 检测剪贴板复制事件并处理内容
    document.addEventListener('copy', async function(event) {
        try {
            // 获取剪贴板内容
            const clipboardText = await navigator.clipboard.readText();

            // 处理剪贴板内容
            const processedText = clipboardText
                .split('\n')
                .map(line => convertPunctuation(line))
                .join('\n');

            // 写回剪贴板
            await navigator.clipboard.writeText(processedText);
            console.log("Processed text written back to clipboard!");
        } catch (error) {
            console.error("Error processing clipboard text:", error);
        }
    });

    console.log("Latex_Automatic Formatting script initialized!");
})();
