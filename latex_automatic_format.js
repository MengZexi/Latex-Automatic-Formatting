// ==UserScript==
// @name         Latex_Automatic Formatting
// @namespace    http://tampermonkey.net/
// @version      v0.71
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
    const createMenu = (x, y) => {
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
        const activeElement = document.activeElement;               // current active element is input textarea

        if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
            console.log('Mouse in the text box:', activeElement);
        } else {
            console.log('Mouse is not in the text box. ');
        }

        // options
        const options = selectedText
            ? [
                { label: 'copy(text)', action: () => copyToClipboard1(selectedText) },
                { label: 'add$', action: () => copyToClipboard3(selectedText, activeElement) },
                { label: 'sub$', action: () => copyToClipboard4(selectedText, activeElement) },
                { label: '$to$$', action: () => copyToClipboard5(selectedText, activeElement) },
                { label: 'formula', action: () => copyToClipboard6(selectedText, activeElement) },
            ]
            : [{ label: 'fill', action: () => copyToClipboard2(activeElement) }];

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
        createMenu(e.pageX, e.pageY);
    });


// copy text to clipboard
const copyToClipboard1 = text => {
    const convertPunctuation = text => {
        // Chinese symbol to English symbol
        // Mathematical letters changed to latex format
        // Chemical formula changed to Latex format
        // Punctuation symbol
        // Increment formula sign
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
            .split('\n')                            // Split by line
            .map(line => convertPunctuation(line))  // Process each row
            .join('\n');                            // Reassemble as text
    };

    const processedText = processText(text);

    if (navigator.clipboard && navigator.clipboard.writeText) {   
        navigator.clipboard.writeText(processedText).then(() => {                   // If the navigator.clipboard API is supported
            console.log(`Copied using clipboard API: ${processedText}`);
        }).catch(err => {
            console.error('Clipboard API failed, falling back to execCommand.', err);
            fallbackCopyText(processedText);                                        // Fall back to the compatible method
        });
    } else {
        fallbackCopyText(processedText);                                            // Use the backup method
    }
};

const copyToClipboard2 = (text, TextArea) => {
        const underline = '$\\underline { \\hspace{1cm} }$';

        const start = TextArea.selectionStart;
        const end = TextArea.selectionEnd;

        const processedText = underline;                                                // Copy content to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {   
            navigator.clipboard.writeText(processedText).then(() => {                   // If the navigator.clipboard API is supported
                console.log(`Copied using clipboard API: ${processedText}`);
            }).catch(err => {
                console.error('Clipboard API failed, falling back to execCommand.', err);
                fallbackCopyText(processedText);                                        // Fall back to the compatible method
            });
        } else {
            fallbackCopyText(processedText);                                            // Use the backup method
        }

        TextArea.selectionStart = start;
        TextArea.selectionEnd = end;
        TextArea.focus();                                                               // Make sure the text box is in focus
    };


const copyToClipboard3 = (text, TextArea) => {

    const start = TextArea.selectionStart;          // Save the currently selected text location
    const end = TextArea.selectionEnd;

    if (!text.startsWith('$')) text = `$${text}`;   // Detects and adds $signs to both ends
    if (!text.endsWith('$')) text = `${text}$`;

    const processedText = text;                                                     // Copy content to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {   
        navigator.clipboard.writeText(processedText).then(() => {                   // If the navigator.clipboard API is supported
            console.log(`Copied using clipboard API: ${processedText}`);
        }).catch(err => {
            console.error('Clipboard API failed, falling back to execCommand.', err);
            fallbackCopyText(processedText);                                        // Fall back to the compatible method
        });
    } else {
        fallbackCopyText(processedText);                                            // Use the backup method
    }

    TextArea.selectionStart = start;
    TextArea.selectionEnd = end;
    TextArea.focus();                                                               // Make sure the text box is in focus

    // console.log(`Processed text: ${text}`);
};


const copyToClipboard4 = (text, TextArea) => {

    const start = TextArea.selectionStart;          // Save the currently selected text location
    const end = TextArea.selectionEnd;

    text = text.replace(/\$/g, '');                 // Delete all $signs from the text

    const processedText = text;                                                     // Copy content to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {   
        navigator.clipboard.writeText(processedText).then(() => {                   // If the navigator.clipboard API is supported
            console.log(`Copied using clipboard API: ${processedText}`);
        }).catch(err => {
            console.error('Clipboard API failed, falling back to execCommand.', err);
            fallbackCopyText(processedText);                                        // Fall back to the compatible method
        });
    } else {
        fallbackCopyText(processedText);                                            // Use the backup method
    }

    TextArea.selectionStart = start;
    TextArea.selectionEnd = end;
    TextArea.focus();                                                               // Make sure the text box is in focus
};


const copyToClipboard5 = (text, TextArea) => {

    const start = TextArea.selectionStart;              // Save the currently selected text location
    const end = TextArea.selectionEnd;

    text = text.replace(/^\$|\$$/g, match => `\n$$\n`); // If there is $on both ends, replace it with a line feed

    if (!text.startsWith('\n$$\n')) {                   // If there is no $, add a newline $$newline at both ends
        text = `\n$$\n${text}`;
    }
    if (!text.endsWith('\n$$\n')) {
        text = `${text}\n$$\n`;
    }

    const processedText = text;                                                     // Copy content to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {   
        navigator.clipboard.writeText(processedText).then(() => {                   // If the navigator.clipboard API is supported
            console.log(`Copied using clipboard API: ${processedText}`);
        }).catch(err => {
            console.error('Clipboard API failed, falling back to execCommand.', err);
            fallbackCopyText(processedText);                                        // Fall back to the compatible method
        });
    } else {
        fallbackCopyText(processedText);                                            // Use the backup method
    }

    TextArea.selectionStart = start;
    TextArea.selectionEnd = end;
    TextArea.focus();
};



const copyToClipboard6 = (text, TextArea) => {

    const start = TextArea.selectionStart;              // Save the currently selected text location
    const end = TextArea.selectionEnd;

    const completeLatexFormula = (text) => {            // Complete missing parentheses and special structures in LaTeX formulas
        if (!text.startsWith('$')) {                    // Make sure there are separate $at both ends
            text = `$${text}`;
        }
        if (!text.endsWith('$')) {
            text = `${text}$`;
        }
        let stack = [];                                 // The initialization stack is used for bracket matching
        let result = "";
        const specialCommands = ['\\frac', '\\sqrt', '\\overline', '\\underline'];          // LaTeX Commands that require parameter completion
        for (let i = 0; i < text.length; i++) {                                             // Iterate through the string
            const char = text[i];
            if (char === '\\') {                                                                        // Detect special commands
                const command = specialCommands.find(cmd => text.slice(i, i + cmd.length) === cmd);     // Get the command name
                if (command) {
                    result += command;
                    i += command.length - 1;
                    if (command === '\\frac') {                                             // Complete the required parameters of the command
                        let nextChar = text[i + 1] || '';
                        if (nextChar !== '{') {
                            result += '{?}';                                                // Complete the molecular placeholder
                        }
                        if (!text.slice(i + 1).includes('}') || text.slice(i + 1).indexOf('}') > text.slice(i + 1).indexOf('{')) {
                            result += '{}';                                                 // Complete the denominator placeholder
                        }
                    } else {
                        let nextChar = text[i + 1] || '';
                        if (nextChar !== '{') {
                            result += '{?}';                                                // Placeholder
                        }
                    }
                    continue;
                }
            }
            if (char === '{') {                                                             // Regular bracket matching
                stack.push('{');
            } else if (char === '}') {
                if (stack.length > 0 && stack[stack.length - 1] === '{') {
                    stack.pop();
                } else {
                    result += '{';                                                          // Complete the missing left parenthesis
                }
            }
            result += char;
        }
        while (stack.length > 0) {                                                          // Complete the unmatched left parenthesis
            result += '}';
            stack.pop();
        }
        return result;
    };
    const processedText = completeLatexFormula(text);                                       // LaTeX completion of the input text
    if (navigator.clipboard && navigator.clipboard.writeText) {   
        navigator.clipboard.writeText(processedText).then(() => {                   // If the navigator.clipboard API is supported
            console.log(`Copied using clipboard API: ${processedText}`);
        }).catch(err => {
            console.error('Clipboard API failed, falling back to execCommand.', err);
            fallbackCopyText(processedText);                                        // Fall back to the compatible method
        });
    } else {
        fallbackCopyText(processedText);                                            // Use the backup method
    }

    TextArea.selectionStart = start;
    TextArea.selectionEnd = end;
    TextArea.focus();
};

// The rollback method uses document.execCommand('copy')
const fallbackCopyText = text => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';                                              // Avoid page jumping
    textArea.style.opacity = '0';                                                   // Hide the text box
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

// log script initialization
console.log('Latex_Automatic Formatting : v0.71 Script Updated!');
})();
