function handleInput(element) {
  if (element.textContent.trim() === '') {
    element.parentNode.removeChild(element);
  }
}

// yesir

function enableRightClickCopying() {
    document.addEventListener('contextmenu', (event) => {
        const target = event.target;
        if (target.classList.contains('codeblock')) {
            event.preventDefault(); 
            const textToCopy = target.textContent; 
            
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    console.log('Text copied to clipboard!'); 
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err); 
                });
        }
    });
}


enableRightClickCopying();