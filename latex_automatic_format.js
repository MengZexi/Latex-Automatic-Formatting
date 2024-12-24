// ==UserScript==
// @name         Latex_Automatic Formatting
// @namespace    http://tampermonkey.net/
// @version      v0.72
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
        const activeElement = document.activeElement; // current active element is input textarea

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
        text = text.replace(/，/g, ', ');
        text = text.replace(/。/g, '. ');
        text = text.replace(/！/g, '! ');
        text = text.replace(/？/g, '? ');
        text = text.replace(/；/g, '; ');
        text = text.replace(/：/g, ': ');
        text = text.replace(/“/g, '"');
        text = text.replace(/”/g, '"');
        text = text.replace(/‘/g, "'");
        text = text.replace(/’/g, "'");
        text = text.replace(/（/g, '(');
        text = text.replace(/）/g, ')');
        text = text.replace(/《/g, '<');
        text = text.replace(/》/g, '>');
        text = text.replace(/【/g, '[');
        text = text.replace(/】/g, ']');
        text = text.replace(/、/g, ', ');
        text = text.replace(/⋯/g, '\\cdots');

        // Mathematical letters changed to latex format
        text = text.replace(/α/g, ' \\alpha ');
        text = text.replace(/β/g, ' \\beta ');
        text = text.replace(/γ/g, ' \\gamma ');
        text = text.replace(/δ/g, ' \\delta ');
        text = text.replace(/ε/g, ' \\epsilon ');
        text = text.replace(/ζ/g, ' \\zeta ');
        text = text.replace(/η/g, ' \\eta ');
        text = text.replace(/θ/g, ' \\theta ');
        text = text.replace(/ι/g, ' \\iota ');
        text = text.replace(/κ/g, ' \\kappa ');
        text = text.replace(/λ/g, ' \\lambda ');
        text = text.replace(/μ/g, ' \\mu ');
        text = text.replace(/ν/g, ' \\nu ');
        text = text.replace(/ξ/g, ' \\xi ');
        text = text.replace(/ο/g, ' \\omicron ');
        text = text.replace(/π/g, ' \\pi ');
        text = text.replace(/ρ/g, ' \\rho ');
        text = text.replace(/σ/g, ' \\sigma ');
        text = text.replace(/τ/g, ' \\tau ');
        text = text.replace(/υ/g, ' \\upsilon ');
        text = text.replace(/φ/g, ' \\phi ');
        text = text.replace(/χ/g, ' \\chi ');
        text = text.replace(/ψ/g, ' \\psi ');
        text = text.replace(/ω/g, ' \\omega ');
        text = text.replace(/Α/g, ' \\Alpha ');
        text = text.replace(/Β/g, ' \\Beta ');
        text = text.replace(/Γ/g, ' \\Gamma ');
        text = text.replace(/Δ/g, ' \\Delta ');
        text = text.replace(/Ε/g, ' \\Epsilon ');
        text = text.replace(/Ζ/g, ' \\Zeta ');
        text = text.replace(/Η/g, ' \\Eta ');
        text = text.replace(/Θ/g, ' \\Theta ');
        text = text.replace(/Ι/g, ' \\Iota ');
        text = text.replace(/Κ/g, ' \\Kappa ');
        text = text.replace(/Λ/g, ' \\Lambda ');
        text = text.replace(/Μ/g, ' \\Mu ');
        text = text.replace(/Ν/g, ' \\Nu ');
        text = text.replace(/Ξ/g, ' \\Xi ');
        text = text.replace(/Ο/g, ' \\Omicron ');
        text = text.replace(/Π/g, ' \\Pi ');
        text = text.replace(/Ρ/g, ' \\Rho ');
        text = text.replace(/Σ/g, ' \\Sigma ');
        text = text.replace(/Τ/g, ' \\Tau ');
        text = text.replace(/Υ/g, ' \\Upsilon ');
        text = text.replace(/Φ/g, ' \\Phi ');
        text = text.replace(/Χ/g, ' \\Chi ');
        text = text.replace(/Ψ/g, ' \\Psi ');
        text = text.replace(/Ω/g, ' \\Omega ');

        // Mathematical symbols changed to latex format
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/\|/g, '\\vert');
        text = text.replace(/∠/g, '\\angle ');
        text = text.replace(/⊥/g, '\\perp ');
        text = text.replace(/∽/g, '\\sim ');
        text = text.replace(/∠/g, '\\angle ');
        text = text.replace(/⊥/g, '\\perp ');
        text = text.replace(/∽/g, '\\sim ');
        text = text.replace(/≈/g, '\\approx ');
        text = text.replace(/≠/g, '\\neq ');
        text = text.replace(/≤/g, '\\leq ');
        text = text.replace(/≥/g, '\\geq ');
        text = text.replace(/∞/g, '\\infty ');
        text = text.replace(/∑/g, '\\sum ');
        text = text.replace(/∏/g, '\\prod ');
        text = text.replace(/∫/g, '\\int ');
        text = text.replace(/∂/g, '\\partial ');
        text = text.replace(/√/g, '\\sqrt ');
        text = text.replace(/∇/g, '\\nabla ');
        text = text.replace(/×/g, '\\times ');
        text = text.replace(/÷/g, '\\div ');
        text = text.replace(/∩/g, '\\cap ');
        text = text.replace(/∪/g, '\\cup ');
        text = text.replace(/∈/g, '\\in ');
        text = text.replace(/∉/g, '\\notin ');
        text = text.replace(/∅/g, '\\emptyset ');
        text = text.replace(/∧/g, '\\wedge ');
        text = text.replace(/∨/g, '\\vee ');
        text = text.replace(/⊂/g, '\\subset ');
        text = text.replace(/⊃/g, '\\supset ');
        text = text.replace(/⊆/g, '\\subseteq ');
        text = text.replace(/⊇/g, '\\supseteq ');
        text = text.replace(/≡/g, '\\equiv ');
        text = text.replace(/⇒/g, '\\Rightarrow ');
        text = text.replace(/⇔/g, '\\Leftrightarrow ');
        text = text.replace(/∝/g, '\\propto ');
        text = text.replace(/∴/g, '\\therefore ');
        text = text.replace(/∵/g, '\\because ');


        // Chemical formula changed to Latex format
        text = text.replace(/CO2/g, ' CO_2 ')
        text = text.replace(/C02/g, ' CO_2 ')
        text = text.replace(/H2O/g, ' H_2O ')
        text = text.replace(/H20/g, ' H_2O ')
        text = text.replace(/CH4/g, ' CH_4 ')
        text = text.replace(/O2/g, ' O_2 ')
        text = text.replace(/N2/g, ' N_2 ')
        text = text.replace(/H2/g, ' H_2 ')
        text = text.replace(/SO2/g, ' SO_2 ')
        text = text.replace(/S02/g, ' SO_2 ')
        text = text.replace(/NO2/g, ' NO_2 ')
        text = text.replace(/N02/g, ' NO_2 ')
        text = text.replace(/NH3/g, ' NH_3 ')
        text = text.replace(/C6H12O6/g, ' C_6H_{12}O_6 ')
        text = text.replace(/C6H1206/g, ' C_6H_{12}O_6 ')
        text = text.replace(/H2SO4/g, ' H_2SO_4 ')
        text = text.replace(/H2S04/g, ' H_2SO_4 ')
        text = text.replace(/NaCl/g, ' NaCl ')
        text = text.replace(/CaCO3/g, ' CaCO_3 ')
        text = text.replace(/CaC03/g, ' CaCO_3 ')
        text = text.replace(/KCl/g, ' KCl ')
        text = text.replace(/MgO/g, ' MgO ')
        text = text.replace(/Mg0/g, ' MgO ')
        text = text.replace(/HCl/g, ' HCl ')
        text = text.replace(/NaOH/g, ' NaOH ')
        text = text.replace(/Na0H/g, ' NaOH ')
        text = text.replace(/KOH/g, ' KOH ')
        text = text.replace(/K0H/g, ' KOH ')
        text = text.replace(/Fe2O3/g, ' Fe_2O_3 ')
        text = text.replace(/Fe203/g, ' Fe_2O_3 ')
        text = text.replace(/Al2O3/g, ' Al_2O_3 ')
        text = text.replace(/Al203/g, ' Al_2O_3 ')
        text = text.replace(/HNO3/g, ' HNO_3 ')
        text = text.replace(/HN03/g, ' HNO_3 ')
        text = text.replace(/CH3COOH/g, ' CH_3COOH ')
        text = text.replace(/CH3C00H/g, ' CH_3COOH ')
        text = text.replace(/C2H5OH/g, ' C_2H_5OH ');
        text = text.replace(/C2H50H/g, ' C_2H_5OH ');

        // Punctuation symbol
        text = text.replace(/([\.,!?:;])/g, ' $1 ')
                    .replace(/([\.,!?:;])\s*\1/g, ' $1 ');

        // Increment formula sign
        // 选项变为多行选项
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
console.log('Latex_Automatic Formatting : v0.71 Script Updated!');
})();
