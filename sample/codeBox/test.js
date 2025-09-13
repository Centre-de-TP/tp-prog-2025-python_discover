(function() {
    'use strict';

    // Copy buttons function
    function flashCopyMessage(el, msg) {
        el.textContent = msg;
        setTimeout(function() {
            el.textContent = "Copier";
        }, 1000);
    }

    function addCopyButton(containerEl) {
        var copyBtn = document.createElement("button");
        copyBtn.className = "copy-button";
        copyBtn.textContent = "Copier";

        var codeEl = containerEl.querySelector("[class^='language-']");
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(codeEl.textContent).then(
                function(){
                    flashCopyMessage(copyBtn, 'Copié !')
                })
                .catch(
                    function(e) {
                        console && console.log(e);
                        flashCopyMessage(copyBtn, 'Raté :\'(')
                    });
        });

        containerEl.appendChild(copyBtn);
    }

    // Add copy button to code blocks
    var highlightBlocks = document.querySelectorAll('.copy-codeblock');
    Array.prototype.forEach.call(highlightBlocks, addCopyButton);
})();
