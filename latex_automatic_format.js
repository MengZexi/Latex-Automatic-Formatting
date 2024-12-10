// ==UserScript==
// @name         Latex_Automatic Formatting
// @namespace    http://tampermonkey.net/
// @version      v0.55
// @description  Typesetting the contents of the clipboard
// @author       Mozikiy
// @match        http://annot.xhanz.cn/project/*/*
// @icon         https://www.latex-project.org/favicon.ico
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // createMenu
    const createMenu = (text, x, y) => {
        // remove existingMenu
        const existingMenu = document.getElementById('custom-context-menu');
        if (existingMenu) existingMenu.remove();

        // create menu
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

        // options
        const options = [
            { label: 'copy(text)', action: () => copyToClipboard1(text) },
            { label: 'copy(fill)', action: () => copyToClipboard2(text) },
            { label: 'add$', action: () => copyToClipboard3(text) },
            { label: 'sub$', action: () => copyToClipboard4(text) },
            { label: '$to$$', action: () => copyToClipboard5(text) },
            { label: 'formula', action: () => copyToClipboard6(text) },
        ];

        // add menu
        options.forEach(opt => {
            const item = document.createElement('div');
            item.innerText = opt.label;
            item.style.padding = '5px';
            item.style.cursor = 'pointer';
            item.style.transition = 'background-color 0.2s ease';
            
            // Highlight on hover
            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = '#f0f0f0'; // Highlight color
            });
            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = ''; // Reset to default
            });

            item.addEventListener('click', () => {
                opt.action();
                menu.remove();
            });

            menu.appendChild(item);
        });

        document.addEventListener('click', () => menu.remove(), { once: true });

        document.body.appendChild(menu);
    };

    // copy text to clipboard
    const copyToClipboard1 = text => {
        const convertPunctuation = text => {
            text = text.replace(/,/g, ', ');
            text = text.replace(/\./g, '. ');
            text = text.replace(/，/g, ', ');
            text = text.replace(/。/g, '. ');
            text = text.replace(/&gt;/g, '>');
            text = text.replace(/&lt;/g, '<');
            text = text.replace(/, \$/g, '$, ');
            text = text.replace(/\. \$/g, '$. ');
            text = text.replace(/λ/g, '$\\lambda$');
            text = text.replace(/α/g, '$\\alpha$');
            text = text.replace(/β/g, '$\\beta$');
            text = text.replace(/γ/g, '$\\gamma$');
            text = text.replace(/ρ/g, '$\\rho$');
            text = text.replace(/σ/g, '$\\sigma$');
            text = text.replace(/δ/g, '$\\delta$');
            text = text.replace(/φ/g, '$\\varphi$');
            text = text.replace(/：/g, ': ');
            text = text.replace(/⋯/g, '\\cdots');
            text = text.replace(/x,/g, '$x$,');
            text = text.replace(/\|/g, '\\vert');
            text = text.replace(/\. \$/g, '$. ');
            text = text.replace(/, \$/g, '$, ');
            text = text.replace(/,,/g, ', ');
            text = text.replace(/\.\./g, '. ');
            text = text.replace(/, ,/g, ', ');
            text = text.replace(/\. \./g, '. ');
            text = text.replace(/（/g, '(');
            text = text.replace(/）/g, ')');
            text = text.replace(/［/g, '[');
            text = text.replace(/］/g, ']');
            text = text.replace(/C02/g, '$CO_2$');
            text = text.replace(/H2O/g, '$H_2O$');
            text = text.replace(/CO2/g, '$CO_2$');
            text = text.replace(/H20/g, '$H_2O$');
            return text;
        };

        const processText = inputText => {
            return inputText
                .split('\n') // 按行分割
                .map(line => convertPunctuation(line)) // 处理每行
                .join('\n'); // 重新组合为文本
        };

        const processedText = processText(text);

        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 如果支持 navigator.clipboard API
            navigator.clipboard.writeText(processedText).then(() => {
                console.log(`Copied using clipboard API: ${processedText}`);
            }).catch(err => {
                console.error('Clipboard API failed, falling back to execCommand.', err);
                fallbackCopyText(processedText); // 回退到兼容方法
            });
        } else {
            // 使用后备方法
            fallbackCopyText(processedText);
        }
    };

    const copyToClipboard2 = text => {
        const convertPunctuation = text => {
            text.replace(/(?<=[^a-zA-Z0-9]) /g, '$\\underline { \\hspace{1cm} }$');
            text = text.replace(/,/g, ', ');
            text = text.replace(/\./g, '. ');
            text = text.replace(/，/g, ', ');
            text = text.replace(/。/g, '. ');
            text = text.replace(/&gt;/g, '>');
            text = text.replace(/&lt;/g, '<');
            text = text.replace(/, \$/g, '$, ');
            text = text.replace(/\. \$/g, '$. ');
            text = text.replace(/λ/g, '$\\lambda$');
            text = text.replace(/α/g, '$\\alpha$');
            text = text.replace(/β/g, '$\\beta$');
            text = text.replace(/γ/g, '$\\gamma$');
            text = text.replace(/ρ/g, '$\\rho$');
            text = text.replace(/σ/g, '$\\sigma$');
            text = text.replace(/δ/g, '$\\delta$');
            text = text.replace(/φ/g, '$\\varphi$');
            text = text.replace(/：/g, ': ');
            text = text.replace(/⋯/g, '\\cdots');
            text = text.replace(/x,/g, '$x$,');
            text = text.replace(/\|/g, '\\vert');
            text = text.replace(/\. \$/g, '$. ');
            text = text.replace(/, \$/g, '$, ');
            text = text.replace(/,,/g, ', ');
            text = text.replace(/\.\./g, '. ');
            text = text.replace(/, ,/g, ', ');
            text = text.replace(/\. \./g, '. ');
            text = text.replace(/（/g, '(');
            text = text.replace(/）/g, ')');
            text = text.replace(/［/g, '[');
            text = text.replace(/］/g, ']');
            text = text.replace(/C02/g, '$CO_2$');
            text = text.replace(/H2O/g, '$H_2O$');
            text = text.replace(/CO2/g, '$CO_2$');
            text = text.replace(/H20/g, '$H_2O$');
            return text;
        };

        const processText = inputText => {
            return inputText
                .split('\n') // 按行分割
                .map(line => convertPunctuation(line)) // 处理每行
                .join('\n'); // 重新组合为文本
        };

        const processedText = processText(text);

        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 如果支持 navigator.clipboard API
            navigator.clipboard.writeText(processedText).then(() => {
                console.log(`Copied using clipboard API: ${processedText}`);
            }).catch(err => {
                console.error('Clipboard API failed, falling back to execCommand.', err);
                fallbackCopyText(processedText); // 回退到兼容方法
            });
        } else {
            // 使用后备方法
            fallbackCopyText(processedText);
        }
    };

    const copyToClipboard3 = text => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 如果支持 navigator.clipboard API
            navigator.clipboard.writeText(text).then(() => {
                console.log(`Copied using clipboard API: ${text}`);
            }).catch(err => {
                console.error('Clipboard API failed, falling back to execCommand.', err);
                fallbackCopyText(text); // 回退到兼容方法
            });
        } else {
            // 使用后备方法
            fallbackCopyText(text);
        }
    };

    const copyToClipboard4 = text => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 如果支持 navigator.clipboard API
            navigator.clipboard.writeText(text).then(() => {
                console.log(`Copied using clipboard API: ${text}`);
            }).catch(err => {
                console.error('Clipboard API failed, falling back to execCommand.', err);
                fallbackCopyText(text); // 回退到兼容方法
            });
        } else {
            // 使用后备方法
            fallbackCopyText(text);
        }
    };

    const copyToClipboard5 = text => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 如果支持 navigator.clipboard API
            navigator.clipboard.writeText(text).then(() => {
                console.log(`Copied using clipboard API: ${text}`);
            }).catch(err => {
                console.error('Clipboard API failed, falling back to execCommand.', err);
                fallbackCopyText(text); // 回退到兼容方法
            });
        } else {
            // 使用后备方法
            fallbackCopyText(text);
        }
    };

    const copyToClipboard6 = text => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 如果支持 navigator.clipboard API
            navigator.clipboard.writeText(text).then(() => {
                console.log(`Copied using clipboard API: ${text}`);
            }).catch(err => {
                console.error('Clipboard API failed, falling back to execCommand.', err);
                fallbackCopyText(text); // 回退到兼容方法
            });
        } else {
            // 使用后备方法
            fallbackCopyText(text);
        }
    };
    
    // 回退方法使用 document.execCommand('copy')
    const fallbackCopyText = text => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // 避免页面跳动
        textArea.style.opacity = '0'; // 隐藏文本框
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
    
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log(`Copied using fallback method: ${text}`);
            } else {
                console.error('Fallback method failed.');
            }
        } catch (err) {
            console.error('Fallback method error:', err);
        }
    
        document.body.removeChild(textArea);
    };
    
    // block browser's default context menu
    document.addEventListener('contextmenu', event => {
        event.preventDefault(); // Disable the default right-click menu
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // Create the custom menu at mouse position
            createMenu(selectedText, event.pageX, event.pageY);
            // console.log(selectedText);
        }
    });

    // log script initialization
    console.log('Latex_Automatic Formatting : v0.55 Script Updated!');
})();
