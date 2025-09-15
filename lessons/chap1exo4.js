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
            const penny =  mod.$d.penny;
            const dollar =  mod.$d.dollar;

            if (typeof penny.v === "undefined" || typeof dollar === "undefined") {
                feedback.textContent = "🤔 You are missing a variable.";
            }
            else if (typeof penny.v !== "number" || typeof dollar.v !== "number") {
                feedback.textContent = "🤔 Your variable doesn't have the right type.";
            }
            else {
                if (!code.includes("print(") && !code.includes("print (")) {
                    feedback.textContent = "🤔 You are not displaying anything.";
                }
                else if (!outputEl.textContent.includes(dollar.v + penny.v / 100)) {
                    feedback.textContent = "🤔 There is an error in the result.";
                }
                else if (!code.includes("input(") && !code.includes("input (")) {
                    feedback.textContent = "🤔 You are missing the input.";
                }
                else if (outputEl.textContent.includes(dollar.v + penny.v / 100)) {
                    feedback.textContent = "✅ Success! You did everything correctly.";
                    secondText()
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

function generatePythonVars() {
    let result = "";
    for (let i = 97; i <= 122; i++) { // 97 = 'a', 122 = 'z'
        let letter = String.fromCharCode(i);
        result += `${letter} = "${letter}"\n`;
    }
    return result;
}


function runPythonCode2(codeInputId="codeInput2", outputId="consoleOutput2", feedbackId="feedback2") {
    const code = generatePythonVars() + document.getElementById(codeInputId).value;
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
            if (code.includes("print") && code.includes("+") && outputEl.textContent.includes("river")) {
                feedback.textContent = "✅ Success! You did everything correctly.";
                thirdText()
            }
            else if (!code.includes("print")) {
                feedback.textContent = "🤔 You are not displaying anything.";
            }
            else if (!code.includes("+")) {
                feedback.textContent = "🤔 You can read the help to see how to combine strings.";
            }
            else if (!outputEl.textContent.includes("river")) {
                feedback.textContent = "🤔 The displayed value is incorrect.";
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
    document.body.style.background = "url(../Background/forset.jpg)";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";

    const lines = [
        [3000, "Hi again you, ready for the next part ?", "../Pixi/happy.png"],
        [3000, "Oh no", "../Pixi/sad.png"],
        [3000, "I just noticed you may be thirsty already !", "../Pixi/sad.png"],
        [3000, "Let's see how much money do we have.", "../Pixi/normal.png"],
        [4500, "Now that you are a master of asking, let's combine everything we learned.", "../Pixi/happy.png"],
        [3000, "hmm..", "../Pixi/normal.png"],
        [4000, "I think mathematics will be useful.", "../Pixi/normal.png"]
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
    document.body.style.background = "url(../Background/forest.png)";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    const lines = [
        [5000, "I can't believe you haven't seen", "../Pixi/sad.png"],
        [5000, "Hahahaha !!", "../Pixi/happy.png"],
        [4000, "We are in a forest, money won't be useful here", "../Pixi/sad.png"],
        [4000, "Well, then we only have one choice left", "../Pixi/normal.png"],
        [4000, "Let's find a river !", "../Pixi/normal.png"]
    ];
    playAssistantLines(lines);
    unhideSecondPart();
}

function thirdText() {
    document.body.style.background = "url(../Background/river.png)";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
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