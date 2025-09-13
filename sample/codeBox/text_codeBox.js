"use strict";

// Found here: https://github.com/skulpt/skulpt/blob/master/HACKING.md
function builtinRead(x)
{
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function createCodeMirrorEditor(txtAreaNode, lang) {
    // Create editor
    var cm = CodeMirror.fromTextArea(txtAreaNode,
        {
            mode: lang,
            lineNumbers: true,
            tabSize: 2,
            theme: "monokai",
        }
    );

    // Set dynamic height
    cm.setSize(null, "auto");

    return cm
}

// Python code blocks
(function () {

    function runCodePython(inputCodeNode, outTxtNode, canvasNode) {
        const code = inputCodeNode.getValue();

        outTxtNode.innerHTML = "";
        Sk.pre = "output";

        Sk.configure({
            // Output appends on the "codeOut" html element.
            output: function (text) {
                outTxtNode.innerHTML = outTxtNode.innerHTML + text;
            },
            read: builtinRead,
            inputfunTakesPrompt: true,
            execLimit: 10000,
            killableWhile: true,
            killableFor: true,
        });

        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = canvasNode;
        var myPromise = Sk.misceval.asyncToPromise(function () {
            return Sk.importMainWithBody("<stdin>", false, code, true);
        });
        myPromise.then(
            function (mod) {
                console.log("success");
            },
            function (err) {
                console.log("failed");
                outTxtNode.innerText = err.toString();
            }
        );
    }

    function initCodePython(codeBlock) {
        console.log("initCodePython");
        const textArea = codeBlock.querySelector(".prolo-codeblock-input");
        const outTxt = codeBlock.querySelector(".prolo-codepython-output");
        const outCanvas = codeBlock.querySelector(".prolo-codepython-canvas");
        const runBtn = codeBlock.querySelector(".prolo-codeblock-run-btn");

        // CodeMirror fails to init properly if not shown on screen.
        // This poses a problem if it is in a details node.
        // To solve it, we open before initialization, and close it after
        const parentElt = codeBlock.parentNode;
        if ($(parentElt).is('details'))
            parentElt.open = true;

        // Replace the text-area with a CodeMirror block,
        // which includes line numbers and syntax highlighting.
        const codeMirror = createCodeMirrorEditor(textArea, "python");

        runBtn.addEventListener(
            "click",
            function() {runCodePython(codeMirror, outTxt, outCanvas);}
        );

        if ($(parentElt).is('details'))
            parentElt.open = false;
    }

    // Get all the Python code blocks and initialize them,
    let pythonCodeBlocks = document.querySelectorAll(".prolo-codepython");
    pythonCodeBlocks.forEach(initCodePython);
})();

// HTML code blocks
(function (){
    function renderHTML(htmlText, outFrame) {
        const MAX_LENGTH = 20_000; // For easier changes

        var out = outFrame.contentWindow.document;
        const error = document.querySelector(".prolo-codehtml-error");
        out.open();
        out.write("<!DOCTYPE html>"); // Added to shut up the "Quirks" warning.

        if (htmlText.length > MAX_LENGTH) {
            outFrame.style.display = "none";
            error.style.display = "block";
            console.log(`Votre code est trop long, la taille maximum autorisée est ${MAX_LENGTH}. Votre code fait actuellement ${htmlText.length} caractères de long.`)
            error.innerText = `Votre code est trop long, la taille maximum autorisée est ${MAX_LENGTH}. Votre code fait actuellement ${htmlText.length} caractères de long.`;
        } else {
            outFrame.style.display = "block";
            error.style.display = "none";
            out.write(htmlText);
        }

        out.close();
    }

    function initCodeHTML(codeBlock) {
        console.log("initCodeBlock");
        const textArea = codeBlock.querySelector(".prolo-codeblock-input");
        const outFrame = codeBlock.querySelector(".prolo-codeblock-result");

        // Replace the text-area with a CodeMirror block,
        // which includes line numbers and syntax highlighting.
        const codeMirror = createCodeMirrorEditor(textArea, "htmlmixed");

        codeMirror.on("change", (codeMirror, change) => {
            renderHTML(codeMirror.getValue(), outFrame)
        });

        renderHTML(codeMirror.getValue(), outFrame);
    }

    // Get all the HTML code blocks and initialize them,
    let htmlCodeBlocks = document.querySelectorAll(".prolo-codehtml");
    htmlCodeBlocks.forEach(initCodeHTML);
})();
