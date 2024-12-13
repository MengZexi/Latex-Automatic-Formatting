// ==UserScript==
// @name         Latex_Automatic Formatting
// @namespace    http://tampermonkey.net/
// @version      v0.73
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
        // 选项变为多行选项
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

const copyToClipboard2 = (TextArea) => {
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
    const start = TextArea.selectionStart; // Save the current selection start position
    const end = TextArea.selectionEnd; // Save the current selection end position

    // Function to complete LaTeX formulas by adding missing brackets and parameters
    const completeLatexFormula = (text) => {
        // Ensure the formula starts and ends with $
        if (!text.startsWith('$')) {
            text = `$${text}`;
        }
        if (!text.endsWith('$')) {
            text = `${text}$`;
        }

        // Remove the outer $ symbols for internal processing
        let content = text.slice(1, -1);

        // Initialize a stack for matching brackets
        let stack = [];
        let result = "";

        // List of LaTeX commands that require parameter completion
        const specialCommands = ['\\frac', '\\sqrt', '\\overline', '\\underline'];

        // Iterate through the string content
        for (let i = 0; i < content.length; i++) {
            const char = content[i];

            // Detect special commands
            if (char === '\\') {
                // Identify the command name
                const command = specialCommands.find(cmd => content.slice(i, i + cmd.length) === cmd);
                if (command) {
                    result += command;
                    i += command.length - 1;

                    // Handle parameter completion for the command
                    if (command === '\\frac') {
                        let nextChar = content[i + 1] || '';
                        if (nextChar !== '{') {
                            result += '{?}'; // Add placeholder for the numerator
                        }
                        if (!content.slice(i + 1).includes('}') || content.slice(i + 1).indexOf('}') > content.slice(i + 1).indexOf('{')) {
                            result += '{}'; // Add placeholder for the denominator
                        }
                    } else {
                        let nextChar = content[i + 1] || '';
                        if (nextChar !== '{') {
                            result += '{?}'; // Add placeholder
                        }
                    }
                    continue;
                }
            }

            // Regular bracket matching
            if (char === '{') {
                stack.push(result.length); // Save the position of the opening bracket
            } else if (char === '}') {
                if (stack.length > 0) {
                    stack.pop(); // Match the last unmatched opening bracket
                } else {
                    result += '{'; // Add a missing opening bracket immediately before the unmatched closing bracket
                }
            }

            result += char;
        }

        // Add closing brackets for unmatched opening brackets
        while (stack.length > 0) {
            const position = stack.pop();
            result = result.slice(0, position + 1) + '}' + result.slice(position + 1); // Insert the closing bracket after the unmatched opening bracket
        }

        // Re-add the outer $ symbols
        return `$${result}$`;
    };

    // Complete the LaTeX formula from the input text
    const processedText = completeLatexFormula(text);

    // Copy the processed text to the clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(processedText).then(() => {
            console.log(`Copied using clipboard API: ${processedText}`);
        }).catch(err => {
            console.error('Clipboard API failed, falling back to execCommand.', err);
            fallbackCopyText(processedText); // Fallback to a compatible method
        });
    } else {
        fallbackCopyText(processedText); // Use a backup method
    }

    // Restore the original selection in the text area
    TextArea.selectionStart = start;
    TextArea.selectionEnd = end;
    TextArea.focus(); // Ensure the text area regains focus
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
console.log('Latex_Automatic Formatting : v0.73 Script Updated!');
})();
