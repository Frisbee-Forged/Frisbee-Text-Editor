// Function to apply text formatting like bold, italic, underline
function format(command) {
    document.execCommand(command, false, null);
}


 
// Auto-save feature using localStorage
setInterval(() => {
    const content = document.getElementById('editor').innerHTML;
    localStorage.setItem('document', content);
}, 5000);

setInterval(() => {
    const shortcutshtml = document.getElementById('shortcuts-area').innerHTML;
    localStorage.setItem('shortcuts-doc-html', shortcutshtml);
}, 5000);

setInterval(() => {
  const shortcuts = document.getElementById('shortcuts-area').innerText;
  localStorage.setItem('Shortcuts-doc', shortcuts);
  
}, 5000);

// Restore content on page load if available
window.onload = function() {
  const savedContent = localStorage.getItem('document');
  if (savedContent) {
    document.getElementById('editor').innerHTML = savedContent;
  }
  const savedshortcuts = localStorage.getItem('shortcuts-doc-html');
  if (savedshortcuts) {
    document.getElementById('shortcuts-area').innerHTML = savedshortcuts;
  }
};
// Function to export content as a PDF
function exportPDF() {
    const element = document.getElementById('editor');
    html2pdf().from(element).save();
}

document.getElementById('markdown-export').addEventListener('click',
function exportmarkdown() {
  const mdinput = document.getElementById('editor').innerHTML;
        console.log(
          mdinput
        )
        const turndownService = new TurndownService();

        // Convert HTML to Markdown
        const mdoutput = turndownService.turndown(mdinput);

        const blob = new Blob([mdoutput], { type: 'text/markdown' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'file.md';
            link.click();
});
document.getElementById('editor').addEventListener('input', function () {
    applyTextShortcuts(this);
});

 
 
// Function to apply text shortcuts like -bold-, _italic_, and ~strikethrough~
function applyTextShortcuts(editor) {
    let content = editor.innerHTML;
    // Convert -bold- to <b>bold</b>
    content = content.replace(/-(.*?)-/g, '<b>$1</b>');

    // Convert _italic_ to <i>italic</i>
    content = content.replace(/_(.*?)_/g, '<i>$1</i>');

    // Convert ~strikethrough~ to <strike>strikethrough</strike>
    content = content.replace(/~(.*?)~/g, '<strike>$1</strike>');
    
    content = content.replace(/#(.*?)#/g, '<h1>$1</h1>');
    
    content = content.replace(/—(.*?)—/g, '<h2>$1</h2>');
    
    content = content.replace(/@nav(.*?)@nav/g, '<nav>$1</nav>');
    
    eval(document.getElementById('shortcuts-area').innerText)
    
    if (content !== editor.innerHTML) {
        editor.innerHTML = content;
        placeCaretAtEnd(editor);
        console.log(content);
    }
}

// Function to move the caret to the end after content update
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

// Event listener to detect when Enter is pressed
document.getElementById('editor').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default new line behavior
        handleEnter(this);
    }
});

// Function to handle Enter key
function handleEnter(editor) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const currentNode = range.startContainer;

    // Check if the current node is a text node
    if (currentNode.nodeType === Node.TEXT_NODE) {
        const lineText = currentNode.textContent;

        // Check if the line contains the command $dlt and if the checkbox is checked
        const dltClearEnabled = document.getElementById('dlt-clear').checked;
        if (lineText.includes('$dlt') && dltClearEnabled) {
            // Clear the entire line by getting the parent node
            const parentNode = currentNode.parentNode;
            parentNode.innerHTML = ''; // Clear the line content

            // Create a new <div> element for the new line
            const newLine = document.createElement('div');
            newLine.innerHTML = '<br>'; // Add a line break

            // Append the new line
            editor.appendChild(newLine);
            placeCaretAtEnd(editor);
            return; // Exit the function early
        }
    }

    // Create a new <div> element for the new line if no command was found
    const newLine = document.createElement('div');
    newLine.innerHTML = '<br>'; // Add a line break

    // Append the new line
    editor.appendChild(newLine);
    placeCaretAtEnd(editor);
}

// Event listener for the settings button
document.getElementById('settings-button').addEventListener('click', function () {
    const settingsMenu = document.getElementById('settings-menu');
    const overlay = document.getElementById('overlay');

    if (settingsMenu.style.display === 'none') {
        settingsMenu.style.display = 'block'; // Show the settings menu
        overlay.style.display = 'block'; // Show the overlay
    } else {
        settingsMenu.style.display = 'none'; // Hide the settings menu
        overlay.style.display = 'none'; // Hide the overlay
    }
});

document.getElementById('file-button').addEventListener('click', function () {
    const fileMenu = document.getElementById('file-menu');
    const overlay = document.getElementById('overlay');

    if (fileMenu.style.display === 'none') {
        fileMenu.style.display = 'block'; // Show the file menu
        overlay.style.display = 'block'; // Show the overlay
    } else {
        fileMenu.style.display = 'none'; // Hide the file menu
        overlay.style.display = 'none'; // Hide the overlay
    }
});

document.getElementById('shortcuts-button').addEventListener('click', function () {
    const shortcutsMenu = document.getElementById('shortcuts-menu');
    const overlay = document.getElementById('overlay');

    if (shortcutsMenu.style.display === 'none') {
        shortcutsMenu.style.display = 'block'; // Show the shortcuts menu
        overlay.style.display = 'block'; // Show the overlay
    } else {
        shortcutsMenu.style.display = 'none'; // Hide the shortcuts menu
        overlay.style.display = 'none'; // Hide the overlay
    }
});

// Event listener for saving settings
document.getElementById('save-file').addEventListener('click', function () {
 
  document.getElementById('file-menu').style.display = 'none';
    overlay.style.display = 'none'; // Hide the overlay
});

// Event listener for close button
document.getElementById('close-file').addEventListener('click', function () {
    document.getElementById('file-menu').style.display = 'none';
    document.getElementById('overlay').style.display = 'none'; // Hide the overlay
});

document.getElementById('save-shortcuts').addEventListener('click', function () {
 
  document.getElementById('shortcuts-menu').style.display = 'none';
    overlay.style.display = 'none'; // Hide the overlay
});

// Event listener for close button
document.getElementById('close-shortcuts').addEventListener('click', function () {
    document.getElementById('shortcuts-menu').style.display = 'none';
    document.getElementById('overlay').style.display = 'none'; // Hide the overlay
});


document.getElementById('save-settings').addEventListener('click', function () {
    const fontSize = document.getElementById('font-size-select').value;
    const theme = document.getElementById('theme-select').value;

    // Apply font size to the editor
    document.getElementById('editor').style.fontSize = fontSize;

    // Change theme (light/dark)
    if (theme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.remove('darkred-theme')
        document.body.classList.add('dark-theme');
        document.getElementById('editor').classList.remove('light-theme');
        document.getElementById('editor').classList.remove('darkred-theme');
        document.getElementById('editor').classList.add('dark-theme');
    } else if (theme === 'dark-red') {
        document.body.classList.remove('light-theme');
        document.body.classList.remove('dark-theme')
        document.body.classList.add('darkred-theme');
        document.getElementById('editor').classList.remove('light-theme');
        document.getElementById('editor').classList.remove('dark-theme');
        document.getElementById('editor').classList.add('darkred-theme');
    } else {
      document.body.classList.remove('darkred-theme');
        document.body.classList.remove('dark-theme')
        document.body.classList.add('light-theme');
        document.getElementById('editor').classList.remove('darkred-theme');
        document.getElementById('editor').classList.remove('dark-theme');
        document.getElementById('editor').classList.add('light-theme');
    }

    // Close the settings menu after saving
    document.getElementById('settings-menu').style.display = 'none';
    overlay.style.display = 'none'; // Hide the overlay
});

// Event listener for close button
document.getElementById('close-settings').addEventListener('click', function () {
    document.getElementById('settings-menu').style.display = 'none';
    document.getElementById('overlay').style.display = 'none'; // Hide the overlay
});

const fullscreenBtn = document.getElementById('fullscreenBtn');

        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
