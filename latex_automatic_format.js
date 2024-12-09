// ==UserScript==
// @name         Latex_Automatic Formatting
// @namespace    http://tampermonkey.net/
// @version      v0.46
// @description  Typesetting the contents of the clipboard
// @author       Mozikiy
// @match        https://blog.csdn.net/*/article/details/*
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
            { label: 'copy(text)', action: () => copyToClipboard(text) },
            { label: 'copy(fill)', action: () => copyToClipboard(`Filled: ${text}`) },
            { label: 'add$', action: () => copyToClipboard(`$${text}$`) },
            { label: 'sub$', action: () => copyToClipboard(`\\(${text}\\)`) },
            { label: '$to$$', action: () => copyToClipboard(text.replace(/\$/g, '$$')) },
            { label: 'formula', action: () => copyToClipboard(`Formula: $$${text}$$`) },
        ];

        // add menu
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

        document.addEventListener('click', () => menu.remove(), { once: true });

        document.body.appendChild(menu);
    };

    // copy text to clipboard
    const copyToClipboard = text => {
        navigator.clipboard.writeText(text).then(() => {
            console.log(`Copied to clipboard: ${text}`);
        });
    };

    // listen mouse up event
    document.addEventListener('mouseup', event => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // Directly create the menu without waiting for right-click
            createMenu(selectedText, event.pageX, event.pageY);
        }
    });

    console.log('Latex_Automatic Formatting : v0.46 Script Updated!');
})();
