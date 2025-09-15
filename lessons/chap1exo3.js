import {ChangeName, GetInfo, UpdateSuccess} from "./token.js";

function playAssistantLines(lines) {
    const bubble = document.getElementById("assistantBubble");
    const img = document.getElementById("assistantImage");

    let i = 0;

    function showNextLine() {
        if (i < lines.length) {
            const [time, text, image] = lines[i];

            // Met à jour le texte et l'image
            bubble.textContent = text;
            bubble.style.display = "block";
            if (image) img.src = image;

            // Passe à la prochaine phrase après le temps indiqué
            setTimeout(() => {
                bubble.style.display = "none";
                i++;
                showNextLine();
            }, time);
        }
    }

    showNextLine();
}

// Fonction pour exécuter du code Python et afficher la sortie
function runPythonCode(codeInputId="codeInput", outputId="consoleOutput", feedbackId="feedback") {
    const code = document.getElementById(codeInputId).value;
    const outputEl = document.getElementById(outputId);
    const feedback = document.getElementById(feedbackId);

    // Reset output et feedback
    outputEl.textContent = "";
    feedback.textContent = "";

    // Configure Skulpt
    Sk.configure({
        output: function(text) {
            outputEl.textContent += text; // écrit dans notre console
        },
        read: function(x) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
            return Sk.builtinFiles["files"][x];
        },
        inputfunTakesPrompt: true,
        execLimit: 10000,
        killableWhile: true,
        killableFor: true,
    });

    // Exécution asynchrone
    Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, code, true);
    }).then(
        function(mod) {
            // .$d est un dict Python (Sk.builtin.dict)
            const namePy =  mod.$d.username;
            if (namePy === undefined) {
                feedback.textContent = "🤔 You are missing the username variable.";
            }
            else {
                const name = namePy.v;
                ChangeName(name);

                if (code.includes("input") && code.includes("Username") && outputEl.textContent.includes(name)) {
                    feedback.textContent = "✅ Success! You did everything correctly.";
                    secondText()
                }
                else if (!code.includes("input(") && !code.includes("input (")) {
                    feedback.textContent = "🤔 You are not asking anything.";
                }
                else if (!code.includes("Username")) {
                    feedback.textContent = "🤔 You are missing the \"Username\" in the input.";
                }
                else if (!code.includes("print(") && !code.includes("print (")) {
                    feedback.textContent = "🤔 You are not displaying anything.";
                }
                else {
                    feedback.textContent = "❌ The code wasn't correct. Let's try again!";
                }
            }
        },
        function(err) {
            feedback.textContent = "⚠️ Error: " + err.toString();
        }
    );
}

function runPythonCode2(codeInputId="codeInput2", outputId="consoleOutput2", feedbackId="feedback2") {
    const code = document.getElementById(codeInputId).value;
    const outputEl = document.getElementById(outputId);
    const feedback = document.getElementById(feedbackId);

    // Reset output et feedback
    outputEl.textContent = "";
    feedback.textContent = "";

    // Configure Skulpt
    Sk.configure({
        output: function(text) {
            outputEl.textContent += text; // écrit dans notre console
        },
        read: function(x) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
            return Sk.builtinFiles["files"][x];
        },
        inputfunTakesPrompt: true,
        execLimit: 10000,
        killableWhile: true,
        killableFor: true,
    });

    // Exécution asynchrone
    Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, code, true);
    }).then(
        function(mod) {
            // Vérifie si la sortie est "open" pour ton exo
            if (code.includes("int(a)") && code.includes("print") && code.includes("a =")
                && code.includes("b =") && outputEl.textContent.includes("<class 'int'>")) {
                feedback.textContent = "✅ Success! You did everything correctly.";
                thirdText()
            }
            else if (!code.includes("int(a)")) {
                feedback.textContent = "🤔 Did you forgot your cast ? Try to use the help button.";
            }
            else if (!code.includes("print")) {
                feedback.textContent = "🤔 You are not displaying anything.";
            }
            else if (!code.includes("a =")) {
                feedback.textContent = "🤔 The variable \"a\" hasn't been defined yet.";
            }
            else if (!code.includes("b =")) {
                feedback.textContent = "🤔 The variable \"b\" hasn't been defined yet.";
            }
            else if (!outputEl.textContent.includes("<class 'int'>")) {
                feedback.textContent = "🤔 The result class should look like : <class 'int'>";
            }
            else {
                feedback.textContent = "❌ The code wasn't correct. Let's try again!";
            }
        },
        function(err) {
            feedback.textContent = "⚠️ Error: " + err.toString();
        }
    );
}

function unhideSecondPart() {
    const part = document.getElementById('secondPart');
    part.classList.remove("hide");
}

function unhideThirdPart() {
    UpdateSuccess(4);
    const part = document.getElementById('thirdPart');
    part.classList.remove("hide");
}


function main() {
    const lines = [
        [2000, "Nice to see you again today !", "../Pixi/happy.png"],
        [4500, "I remember that you told me your name in the last lesson..", "../Pixi/sad.png"],
        [3000, "But...", "../Pixi/sad.png"],
        [3000, "I think I forgot again.", "../Pixi/sad.png"],
        [4000, "Maybe because we haven't saw a memory system until now.", "../Pixi/normal.png"],
        [4000, "So, now that you are fully awake, let's discover that !!", "../Pixi/happy.png"],
        [4000, "Use the concept of variables to store the user input.", "../Pixi/normal.png"]
    ];
    playAssistantLines(lines);

    let exec1 = document.getElementById("runCode");
    exec1.addEventListener("click", (e) => {
        runPythonCode();
    });

    let exec2 = document.getElementById("runCode2");
    exec2.addEventListener("click", (e) => {
        runPythonCode2();
    });
}

function secondText() {
    const lines = [
        [3000, "Thanks, now I will always remember you !", "../Pixi/happy.png"],
        [4000, "But I'm thinking about one thing again.", "../Pixi/normal.png"],
        [4000, "If you have a number in a sentence, ..", "../Pixi/normal.png"],
        [4000, "Is it possible to still use it as a number ?", "../Pixi/normal.png"],
        [4000, "Let's see how could you deal with a number inside a sentence !", "../Pixi/happy.png"]
    ];
    playAssistantLines(lines);
    unhideSecondPart();
}

function thirdText() {
    const progress = GetInfo();
    const lines = [
        [3000, "Nice job " + progress["username"], "../Pixi/happy.png"],
        [3000, "It's then possible to deal with operation.", "../Pixi/happy.png"],
        [3000, "I'll be waiting for you in the next mission.", "../Pixi/normal.png"],
        [3000, "I would be very happy if you come to see me.", "../Pixi/normal.png"],
        [10, "", "../Pixi/normal.png"],
    ];
    playAssistantLines(lines);
    unhideThirdPart();
}

main();