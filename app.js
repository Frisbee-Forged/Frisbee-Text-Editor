// Function to apply text formatting like bold, italic, underline, (not sercure need to work on that)
// edit, i cooked.
function format(command) {
            if (command === 'createLink') {
                const url = prompt('Enter the URL:');
                if (url) {
                    const validatedUrl = url.startsWith('http') ? url : 'http://' + url;
                    document.execCommand(command, false, validatedUrl);
                }
            } else {
                document.execCommand(command, false, null);
            }
        }
        document.getElementById('editor').addEventListener('click', function (event) {
            if (event.target.tagName === 'A') {
              let editorlink = document.getElementById("links-click").checked;
                event.preventDefault();
                if (editorlink) {
                window.open(event.target.href, '_blank');
                console.log('Link clicked:', event.target.href);
                }
            }
        });

window.onload = function() {
  const savedContent = localStorage.getItem('document');
  if (savedContent) {
    document.getElementById('editor').innerHTML = savedContent;
  }
  clearHighlights() 
  loadkeywords();
  loadTheme();
  setcheckbox();
  setfontsize();
  };
 
// Auto-save local
setInterval(() => {
    const content = document.getElementById('editor').innerHTML;
    localStorage.setItem('document', content);
}, 5000);

setInterval(() => {
    savingpop();
    savekeywords();
    saveTheme();
    savecheckbox();
    savefontsize();
}, 5000)

function savingpop() {
    const savingPop = document.getElementById("saving-pop");
    savingPop.style.display = "inline-flex"; 

    setTimeout(() => {
        savingPop.style.display = "none"; 
    }, 1500);
}

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
  applyTextShortcuts(editor);
});

 
let defaultkeywords = {
    '-': ['<b>', '</b>'], 
    '_': ['<i>', '</i>'],
    '~': ['<strike>', '</strike>'],
    '@h1': ['<h1>', '</h1>'], 
    '@h2': ['<h2>', '</h2>'],
    '@h3': ['<h3>', '</h3>'],
    '@cb': ['<div class="codeblock" contenteditable="true">', '</div>'],
     };

let keywords = {}

function addkeyword(key, startTag, endTag) {
  if (keywords[key]) {
     alert(`The keyword "${key}" already exists! This May Cause Problems.`);
     return;
  } 
    keywords[key] = [startTag, endTag];
  
}

function resetkeywords() {
  keywords = defaultkeywords
  savekeywords();
  alert("keywords have been reset to the default setup")
}

function reseteditor() {
  document.getElementById('editor').textContent = "type stuff here."
  alert("editor's content have been Cleared!")
}

function savekeywords() {
    localStorage.setItem('keywords', JSON.stringify(keywords));
}

function loadkeywords() {
    const savedKeywords = localStorage.getItem('keywords');
    
    if (savedKeywords) {
        keywords = JSON.parse(savedKeywords);
    } else {
      keywords = defaultkeywords
    }
}

function addKeywordFromPrompt() {
    const key = prompt("Enter the keyword (e.g., @keyword):");
    const startTag = prompt("Enter the start tag (e.g., <tag>):");
    const endTag = prompt("Enter the end tag (e.g., </tag>):");

    if (key && startTag && endTag) {
        addkeyword(key, startTag, endTag);
        alert(`Keyword "${key}" added successfully!`);
    } else {
        alert("All fields are required.");
    }
}

function applykeywords(content) {
    Object.keys(keywords).forEach(key => {
        let startTag = keywords[key][0];
        let endTag = keywords[key][1];
        let regex = new RegExp(`${key}(.*?)${key}`, 'g');
        content = content.replace(regex, `${startTag}$1${endTag}`);
    });
    return content;
}

function applyTextShortcuts(editor) {
    let content = editor.innerHTML;
    
    content = applykeywords(content);
    
    if (content !== editor.innerHTML) {
        editor.innerHTML = content;
        placeCaretAtEnd(editor);
        console.log(content);
    }
}

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


document.getElementById('editor').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // idk what this does i saw it in a tutorial.
        handleEnter(this);
    }
});


function handleEnter(editor) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const currentNode = range.startContainer;

    
    if (currentNode.nodeType === Node.TEXT_NODE) {
        const lineText = currentNode.textContent;
        const dltClearEnabled = document.getElementById('dlt-clear').checked;
        if (lineText.includes('$dlt') && dltClearEnabled) {
            const parentNode = currentNode.parentNode;
            parentNode.innerHTML = ''; const newLine = document.createElement('div');
            newLine.innerHTML = '<br>'; editor.appendChild(newLine);
            placeCaretAtEnd(editor)
            return; 
        }
    }

    const newLine = document.createElement('div');
    newLine.innerHTML = '<br>'; 

    // new line
    editor.appendChild(newLine);
    placeCaretAtEnd(editor);
}

// lorem ipsum
document.getElementById('settings-button').addEventListener('click', function () {
    const settingsMenu = document.getElementById('settings-menu');
    const overlay = document.getElementById('overlay');

    if (settingsMenu.style.display === 'none') {
        settingsMenu.style.display = 'block'; 
        overlay.style.display = 'block'; } else {
        settingsMenu.style.display = 'none'; 
        overlay.style.display = 'none'; 
    }
});

document.getElementById('file-button').addEventListener('click', function () {
    const fileMenu = document.getElementById('file-menu');
    const overlay = document.getElementById('overlay');

    if (fileMenu.style.display === 'none') {
        fileMenu.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        fileMenu.style.display = 'none';
        overlay.style.display = 'none';
    }
});

document.getElementById('keywords-button').addEventListener('click', function () {
    const keywordsMenu = document.getElementById('keywords-menu');
    const keywordslist = document.getElementById('keywords-list');
    const overlay = document.getElementById('overlay');

    if (keywordsMenu.style.display === 'none') {
        keywordsMenu.style.display = 'block'; 
        overlay.style.display = 'block';
    } else {
        keywordsMenu.style.display = 'none';
        overlay.style.display = 'none';
    }
});

document.getElementById('save-file').addEventListener('click', function () {
 
  document.getElementById('file-menu').style.display = 'none';
    overlay.style.display = 'none';
});


document.getElementById('close-file').addEventListener('click', function () {
    document.getElementById('file-menu').style.display = 'none';
    document.getElementById('overlay').style.display = 'none'; 
});

document.getElementById('save-keywords').addEventListener('click', function () {
 
  document.getElementById('keywords-menu').style.display = 'none';
    overlay.style.display = 'none'; 
});


document.getElementById('close-keywords').addEventListener('click', function () {
    document.getElementById('keywords-menu').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

function savefontsize() {
  localStorage.setItem('fontsize', document.getElementById('font-size-select').value);
}
function saveTheme() {
  localStorage.setItem('theme', document.getElementById('theme-select').value);
}
function setfontsize() {
  const savedfontsize = localStorage.getItem('fontsize')
  if (savedfontsize) {
    document.getElementById('editor').style.fontSize = savedfontsize;
    document.getElementById('font-size-select').value = savedfontsize;
  }
}
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      theme = savedTheme
      document.getElementById('theme-select').value = savedTheme
       checkTheme();
    }
}

function savecheckbox() {
  localStorage.setItem('$dltenabled', document.getElementById('dlt-clear').checked);
  localStorage.setItem('editorlinkenabled', document.getElementById('links-click').checked);
}

function setcheckbox() {
  let saveddlt = localStorage.getItem("$dltenabled");
  let savededitorlink = localStorage.getItem("editorlinkenabled")
    dltClearEnabled = saveddlt
    document.getElementById('dlt-clear').checked = saveddlt
    editorlink = savededitorlink
    document.getElementById('links-click').checked = savededitorlink
}

function checkTheme() {
  if (theme === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.remove('modern-theme');
    document.body.classList.remove('darkred-theme');
    document.body.classList.remove('retro-theme');
    document.body.classList.remove('halloween-theme'); // Remove Halloween theme
    document.body.classList.add('dark-theme');
    document.getElementById('editor').classList.remove('light-theme');
    document.getElementById('editor').classList.remove('darkred-theme');
    document.getElementById('editor').classList.remove('modern-theme');
    document.getElementById('editor').classList.remove('retro-theme');
    document.getElementById('editor').classList.remove('halloween-theme'); // Remove Halloween theme
    document.getElementById('editor').classList.add('dark-theme');
  } else if (theme === 'darkred') {
    document.body.classList.remove('light-theme');
    document.body.classList.remove('dark-theme');
    document.body.classList.remove('modern-theme');
    document.body.classList.remove('retro-theme');
    document.body.classList.remove('halloween-theme'); // Remove Halloween theme
    document.body.classList.add('darkred-theme');
    document.getElementById('editor').classList.remove('light-theme');
    document.getElementById('editor').classList.remove('dark-theme');
    document.getElementById('editor').classList.remove('modern-theme');
    document.getElementById('editor').classList.remove('retro-theme');
    document.getElementById('editor').classList.remove('halloween-theme'); // Remove Halloween theme
    document.getElementById('editor').classList.add('darkred-theme');
  } else if (theme === 'retro') {
    document.body.classList.remove('darkred-theme');
    document.body.classList.remove('dark-theme');
    document.body.classList.remove('light-theme');
    document.body.classList.remove('modern-theme');
    document.body.classList.remove('halloween-theme'); // Remove Halloween theme
    document.body.classList.add('retro-theme');
    document.getElementById('editor').classList.remove('darkred-theme');
    document.getElementById('editor').classList.remove('dark-theme');
    document.getElementById('editor').classList.remove('modern-theme');
    document.getElementById('editor').classList.remove('light-theme');
    document.getElementById('editor').classList.remove('halloween-theme'); // Remove Halloween theme
    document.getElementById('editor').classList.add('retro-theme');
  } else if (theme === 'modern') {
    document.body.classList.remove('darkred-theme');
    document.body.classList.remove('dark-theme');
    document.body.classList.remove('light-theme');
    document.body.classList.remove('retro-theme');
    document.body.classList.remove('halloween-theme'); // Remove Halloween theme
    document.body.classList.add('modern-theme');
    document.getElementById('editor').classList.remove('darkred-theme');
    document.getElementById('editor').classList.remove('dark-theme');
    document.getElementById('editor').classList.remove('retro-theme');
    document.getElementById('editor').classList.remove('light-theme');
    document.getElementById('editor').classList.remove('halloween-theme'); // Remove Halloween theme
    document.getElementById('editor').classList.add('modern-theme');
  } else if (theme === 'halloween') { 
    document.body.classList.remove('light-theme');
    document.body.classList.remove('dark-theme');
    document.body.classList.remove('darkred-theme');
    document.body.classList.remove('retro-theme');
    document.body.classList.add('halloween-theme'); 
    document.getElementById('editor').classList.remove('light-theme');
    document.getElementById('editor').classList.remove('dark-theme');
    document.getElementById('editor').classList.remove('darkred-theme');
    document.getElementById('editor').classList.remove('retro-theme');
    document.getElementById('editor').classList.add('halloween-theme');
  } else {
    document.body.classList.remove('darkred-theme');
    document.body.classList.remove('dark-theme');
    document.body.classList.remove('modern-theme');
    document.body.classList.remove('retro-theme');
    document.body.classList.remove('halloween-theme');
    document.body.classList.add('light-theme');
    document.getElementById('editor').classList.remove('darkred-theme');
    document.getElementById('editor').classList.remove('dark-theme');
    document.getElementById('editor').classList.remove('retro-theme');
    document.getElementById('editor').classList.remove('modern-theme');
    document.getElementById('editor').classList.remove('halloween-theme'); 
    document.getElementById('editor').classList.add('light-theme');
  }
}

document.getElementById('save-settings').addEventListener('click', function () {
    const fontSize = document.getElementById('font-size-select').value;
    const theme = document.getElementById('theme-select').value;
    document.getElementById('editor').style.fontSize = fontSize;
    if (theme === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.remove('modern-theme');
      document.body.classList.remove('darkred-theme');
      document.body.classList.remove('retro-theme');
      document.body.classList.remove('halloween-theme'); 
      document.body.classList.add('dark-theme');
      document.getElementById('editor').classList.remove('light-theme');
      document.getElementById('editor').classList.remove('darkred-theme');
      document.getElementById('editor').classList.remove('modern-theme');
      document.getElementById('editor').classList.remove('retro-theme');
      document.getElementById('editor').classList.remove('halloween-theme'); 
      document.getElementById('editor').classList.add('dark-theme');
    } else if (theme === 'darkred') {
      document.body.classList.remove('light-theme');
      document.body.classList.remove('dark-theme');
      document.body.classList.remove('modern-theme');
      document.body.classList.remove('retro-theme');
      document.body.classList.remove('halloween-theme'); 
      document.body.classList.add('darkred-theme');
      document.getElementById('editor').classList.remove('light-theme');
      document.getElementById('editor').classList.remove('dark-theme');
      document.getElementById('editor').classList.remove('modern-theme');
      document.getElementById('editor').classList.remove('retro-theme');
      document.getElementById('editor').classList.remove('halloween-theme');
      document.getElementById('editor').classList.add('darkred-theme');
    } else if (theme === 'retro') {
      document.body.classList.remove('darkred-theme');
      document.body.classList.remove('dark-theme');
      document.body.classList.remove('light-theme');
      document.body.classList.remove('modern-theme');
      document.body.classList.remove('halloween-theme');
      document.body.classList.add('retro-theme');
      document.getElementById('editor').classList.remove('darkred-theme');
      document.getElementById('editor').classList.remove('dark-theme');
      document.getElementById('editor').classList.remove('modern-theme');
      document.getElementById('editor').classList.remove('light-theme');
      document.getElementById('editor').classList.remove('halloween-theme'); 
      document.getElementById('editor').classList.add('retro-theme');
    } else if (theme === 'modern') {
      document.body.classList.remove('darkred-theme');
      document.body.classList.remove('dark-theme');
      document.body.classList.remove('light-theme');
      document.body.classList.remove('retro-theme');
      document.body.classList.remove('halloween-theme');
      document.body.classList.add('modern-theme');
      document.getElementById('editor').classList.remove('darkred-theme');
      document.getElementById('editor').classList.remove('dark-theme');
      document.getElementById('editor').classList.remove('retro-theme');
      document.getElementById('editor').classList.remove('light-theme');
      document.getElementById('editor').classList.remove('halloween-theme'); 
      document.getElementById('editor').classList.add('modern-theme');
    } else if (theme === 'halloween') { 
      document.body.classList.remove('light-theme');
      document.body.classList.remove('dark-theme');
      document.body.classList.remove('darkred-theme');
      document.body.classList.remove('retro-theme');
      document.body.classList.add('halloween-theme');
      document.getElementById('editor').classList.remove('light-theme');
      document.getElementById('editor').classList.remove('dark-theme');
      document.getElementById('editor').classList.remove('darkred-theme');
      document.getElementById('editor').classList.remove('retro-theme');
      document.getElementById('editor').classList.add('halloween-theme'); // Add Halloween theme
    } else {
      document.body.classList.remove('darkred-theme');
      document.body.classList.remove('dark-theme');
      document.body.classList.remove('modern-theme');
      document.body.classList.remove('retro-theme');
      document.body.classList.remove('halloween-theme'); // Remove Halloween theme
      document.body.classList.add('light-theme');
      document.getElementById('editor').classList.remove('darkred-theme');
      document.getElementById('editor').classList.remove('dark-theme');
      document.getElementById('editor').classList.remove('retro-theme');
      document.getElementById('editor').classList.remove('modern-theme');
      document.getElementById('editor').classList.remove('halloween-theme'); // Remove Halloween theme
      document.getElementById('editor').classList.add('light-theme');
    }
    document.getElementById('settings-menu').style.display = 'none';
    overlay.style.display = 'none';
});

document.getElementById('close-settings').addEventListener('click', function () {
    document.getElementById('settings-menu').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

const fullscreenBtn = document.getElementById('fullscreenBtn');

        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });


let lastMouseX = 0;
  let lastMouseY = 0;
  let findmenu = document.getElementById('find-replace-tool');
  let findmenubtn = document.getElementById('find-tool-btn');
  let findclosebtn = document.getElementById('closefind-tool');

  document.addEventListener('mousemove', (event) => {
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;
  });

  findmenubtn.addEventListener('click', () => {
    findmenu.style.left = `${lastMouseX}px`;
    findmenu.style.top = `${lastMouseY}px`;
    findmenu.style.display = 'block';
  });

  document.addEventListener('click', (event) => {
    if (!findmenu.contains(event.target) && event.target !== findmenubtn) {
      findmenu.style.display = 'none';
      clearHighlights();
    }
  });
  
  findclosebtn.addEventListener('click',
  function() {
    findmenu.style.display = 'none';
      clearHighlights();
  });


let findInput = document.getElementById('findInput');
let replaceInput = document.getElementById('replaceInput');
let findNextBtn = document.getElementById('findNextBtn');
let replaceBtn = document.getElementById('replaceBtn');
let replaceAllBtn = document.getElementById('replaceAllBtn');

function clearHighlights() {
  editor.innerHTML = editor.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g, '$1');
}

function highlightAll() {
  let findTextValue = findInput.value;
  let editorContent = editor.innerHTML;

  // regex bullsh*t
  let escapedFindText = findTextValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  let searchRegExp = new RegExp(escapedFindText, 'gi');

  let highlightedContent = editorContent.replace(searchRegExp, (match) => `<span class="highlight">${match}</span>`);
  editor.innerHTML = highlightedContent;
}

function replaceText() {
  let findTextValue = findInput.value;
  let replaceTextValue = replaceInput.value;
  let editorContent = editor.innerHTML;

  editorContent = editorContent.replace(findTextValue, replaceTextValue);
  editor.innerHTML = editorContent;

  clearHighlights();
}

function replaceAll() {
  let findTextValue = findInput.value;
  let replaceTextValue = replaceInput.value;
  let editorContent = editor.innerHTML;

  let escapedFindText = findTextValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  let searchRegExp = new RegExp(escapedFindText, 'g');

  editorContent = editorContent.replace(searchRegExp, replaceTextValue);
  editor.innerHTML = editorContent;

  clearHighlights();
}

findNextBtn.addEventListener('click', () => {
  clearHighlights();
  highlightAll();
});
replaceBtn.addEventListener('click', replaceText);
replaceAllBtn.addEventListener('click', replaceAll);