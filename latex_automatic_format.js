// ==UserScript==
// @name         Latex_Automatic Formatting
// @namespace    http://tampermonkey.net/
// @version      v0.63
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

        // Detect selected text
        const selectedText = window.getSelection().toString().trim();

        // options
        const options = selectedText
            ? [
                { label: 'copy(text)', action: () => copyToClipboard1(selectedText) },
                { label: 'add$', action: () => copyToClipboard4(selectedText) },
                { label: 'sub$', action: () => copyToClipboard3(selectedText) },
                { label: '$to$$', action: () => copyToClipboard5(selectedText) },
                { label: 'formula', action: () => copyToClipboard6(selectedText) },
            ]
            : [{ label: 'fill', action: () => copyToClipboard2() }];

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

    // Event listener to trigger menu on right-click
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
        const text = window.getSelection().toString().trim();
        createMenu(text, e.pageX, e.pageY);
    });


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
        text = text.replace(/θ/g, '$\\sigma$');
        text = text.replace(/δ/g, '$\\delta$');
        text = text.replace(/φ/g, '$\\varphi$');
        text = text.replace(/：/g, ': ');
        text = text.replace(/⋯/g, '\\cdots');
        // text = text.replace(/x,/g, '$x$,');
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

const copyToClipboard2 = () => {
    const placeholder = '$\\underline { \\hspace{1cm} }$';

    // 获取当前活动的输入框或文本区域
    const activeElement = document.activeElement;

    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const currentValue = activeElement.value;

        // 在光标位置插入占位符
        activeElement.value = currentValue.slice(0, start) + placeholder + currentValue.slice(end);

        // 将光标移动到占位符后
        activeElement.selectionStart = activeElement.selectionEnd = start + placeholder.length;

        // 触发输入事件，确保应用绑定的事件监听器能够响应
        activeElement.dispatchEvent(new Event('input'));

        console.log(`Inserted placeholder into input/textarea: ${placeholder}`);
    } else {
        console.error('No active input or textarea to insert placeholder.');
    }
};


const copyToClipboard3 = text => {
    // 删除文本两端的 $ 符号
    text = text.replace(/^\$|\$$/g, '');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        // 如果支持 navigator.clipboard API
        navigator.clipboard.writeText(text).then(() => {
            console.log(`Copied using clipboard API: ${text}`);

            // 尝试触发粘贴操作
            triggerPaste();
        }).catch(err => {
            console.error('Clipboard API failed, falling back to execCommand.', err);
            fallbackCopyText(text); // 回退到兼容方法
        });
    } else {
        // 使用后备方法
        fallbackCopyText(text);

        // 尝试触发粘贴操作
        triggerPaste();
    }
};

const copyToClipboard4 = text => {
    // 检测并在两端添加 $ 符号
    if (!text.startsWith('$')) text = `$${text}`;
    if (!text.endsWith('$')) text = `${text}$`;

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
    // 删除文本中的所有 $ 符号
    text = text.replace(/\$/g, '');

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


// 自动触发粘贴操作的函数
const triggerPaste = () => {
    const input = document.createElement('textarea'); // 创建一个隐藏的输入框
    document.body.appendChild(input);
    input.focus(); // 将焦点设置到输入框
    document.execCommand('paste'); // 尝试执行粘贴操作
    setTimeout(() => {
        console.log('Pasted text:', input.value); // 输出粘贴的内容（测试用）
        document.body.removeChild(input); // 移除临时输入框
    }, 100); // 等待粘贴内容完成
};


// log script initialization
console.log('Latex_Automatic Formatting : v0.63 Script Updated!');
})();
