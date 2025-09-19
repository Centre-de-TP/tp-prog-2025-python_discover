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

function countOcc(s1, s2) {
    let count = 0;
    let pos = 0;

    while ((pos = s1.indexOf(s2, pos)) !== -1) {
        count++;
        // Move past the current match
        pos += s2.length;
    }
    return count;
}

function runPythonCode3(codeInputId="codeInput3", outputId="consoleOutput3", feedbackId="feedback3") {
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
            const map = [
                ["🚶", "⬜", "🌲", "🐿️", "🪨", "🌾", "🌲", "🌊", "🍄", "🌲"],
                ["🌲", "⬜", "🦊", "🌲", "🌾", "🌲", "🌊", "🪨", "🐗", "🌲"],
                ["🪨", "⬜", "⬜", "⬜", "🍄", "🐍", "🌊", "🌲", "🌾", "🦉"],
                ["🌲", "🐿️", "🐗", "⬜", "🪨", "🌲", "🌊", "🍄", "🌲", "🪨"],
                ["🦊", "🌲", "🪨", "⬜", "🐍", "⬜", "🌊", "🌲", "🐗", "🌾"],
                ["🌲", "🌾", "🌲", "⬜", "⬜", "⬜", "🌊", "🦉", "🍄", "🌲"],
                ["🪨", "🍄", "🐍", "🌾", "🐺", "🦉", "🌊", "🌲", "🌾", "🦊"],
                ["🌾", "🌲", "🦉", "🪨", "🌲", "🐗", "🌊", "🐗", "🌲", "🍄"],
            ];
            if (!code.includes("print")) {
                feedback.textContent = "🤔 You are not displaying anything.";
            }
            else if (countOcc("print", code) > 1) {
                feedback.textContent = "🤔 You are displaying too many things.";
            }
            else if (countOcc("=", code) > 1) {
                feedback.textContent = "🤔 The number of detected variable is to high.";
            }
            else {
                const directions = outputEl.textContent
                let word = "";
                let positionX = 0
                let positionY = 0
                for (const c in directions) {
                    if (word.includes("up")) {
                        word = ""
                        positionY -= 1
                    } else if (word.includes("down")) {
                        word = ""
                        positionY += 1
                    } else if (word.includes("left")) {
                        word = ""
                        positionX -= 1
                    } else if (word.includes("right")) {
                        word = ""
                        positionX += 1
                    }
                    if (positionX < 0 || positionY < 0) {
                        const lines = [
                            [3000, "Your are now too far from the river (outside of the map), let's try again",
                                "../Pixi/angry.png"],
                            [10, "", "../Pixi/normal.png"]
                        ];
                        playAssistantLines(lines);
                    }
                    else {
                        let lines = []
                        switch (map[positionX][positionY]) {
                            case "⬜" :
                                lines = [
                                    [3000, "It's not a river but you can still continue",
                                        "../Pixi/happy.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ Let do it again from the start";
                                playAssistantLines(lines);
                                break;
                            case "🚶" :
                                lines = [
                                    [3000, "Well done, you manage to return to your starting point",
                                        "../Pixi/happy.png"],
                                    [3000, "But for me it doesn't look like a river.",
                                        "../Pixi/sad.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                            case "🌊" :
                                if (!code.includes("*")) {
                                    lines = [
                                        [3000, "Oh no...",
                                            "../Pixi/sad.png"],
                                        [3000, "You arrived to the river but you forgot something (*).",
                                            "../Pixi/sad.png"],
                                        [10, "", "../Pixi/normal.png"]
                                    ];
                                    feedback.textContent = "🤔 I think you forgot the lesson on the *.";
                                    playAssistantLines(lines);
                                }
                                else if (!code.includes("+")) {
                                    lines = [
                                        [3000, "Oh good you did a good job arriving the river",
                                            "../Pixi/angry.png"],
                                        [3000, "You arrived to the river but you forgot something (+).",
                                            "../Pixi/sad.png"],
                                        [10, "", "../Pixi/normal.png"]
                                    ];
                                    feedback.textContent = "🤔 I think you forgot the lesson on the +.";
                                    playAssistantLines(lines);
                                }
                                else
                                {
                                    fourthText()
                                }
                                break;
                            case "🌲" :
                                lines = [
                                    [3000, "This is a tree...",
                                        "../Pixi/angry.png"],
                                    [3000, "But I don't see a magic door.",
                                        "../Pixi/sad.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                            case "🪨" :
                                lines = [
                                    [3000, "Oh, I think I see water !!!",
                                        "../Pixi/happy.png"],
                                    [3000, "Oh no sorry it was the sun reflect on a rock...",
                                        "../Pixi/sad.png"],
                                    [3000, "Don't bring me to this rock again understand.",
                                        "../Pixi/angry.png"],
                                    [3000, "I don't eat or drink rocks.",
                                        "../Pixi/angry.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                            case "🦊" :
                                lines = [
                                    [3000, "I see something moving behind this tree !",
                                        "../Pixi/happy.png"],
                                    [4000, "But whatever, it was orange so just probably a fox not water.",
                                        "../Pixi/sad.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                playAssistantLines(lines);
                                break;
                            case "🐿️" :
                                lines = [
                                    [3000, "May be this squirrel could bring us to the water.",
                                        "../Pixi/normal.png"],
                                    [4000, "You do whatever you want, but I want stay here until he gets out again.",
                                        "../Pixi/angry.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                            case "🐗" :
                                lines = [
                                    [3000, "Runnnn !!!!",
                                        "../Pixi/angry.png"],
                                    [3000, "It's a wild boar.",
                                        "../Pixi/angry.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                            case "🍄" :
                                lines = [
                                    [3000, "Oh purple water !!",
                                        "../Pixi/happy.png"],
                                    [3000, "Wait, . . .",
                                        "../Pixi/fool.png"],
                                    [3000, "Purple !??",
                                        "../Pixi/fool.png"],
                                    [3000, "I think it's the mushroom under our feet.",
                                        "../Pixi/normal.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                            case "🐍" :
                                lines = [
                                    [3000, "A green thing is right ahead of us.",
                                        "../Pixi/normal.png"],
                                    [3000, "May be a snake, I'd not go there if I were you.",
                                        "../Pixi/sad.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                            case "🌾" :
                                lines = [
                                    [3000, "Hmm no, that's corn not water.",
                                        "../Pixi/angry.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                            case "🐺" :
                                lines = [
                                    [3000, "Hmmm...",
                                        "../Pixi/normal.png"],
                                    [3000, "A fox ? No it's darker.",
                                        "../Pixi/normal.png"],
                                    [3000, "A dog ? No it's bigger.",
                                        "../Pixi/normal.png"],
                                    [3000, "It's a wolf pack !!!",
                                        "../Pixi/normal.png"],
                                    [3000, "Run before they sees us !",
                                        "../Pixi/normal.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                            case "🦉" :
                                lines = [
                                    [3000, "You have went to a place which is to dark for me.",
                                        "../Pixi/angry.png"],
                                    [3000, "We can't go further, let's go back.",
                                        "../Pixi/sad.png"],
                                    [10, "", "../Pixi/normal.png"]
                                ];
                                feedback.textContent = "↩️ You are now back to the start";
                                playAssistantLines(lines);
                                break;
                        }
                    }
                }
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
    const part = document.getElementById('thirdPart');
    part.classList.remove("hide");
}

function unhideFourthPart() {
    UpdateSuccess(5);
    const part = document.getElementById('fourthPart');
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
    document.body.style.background = "url(../Background/river.jpeg)";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    const progress = GetInfo();
    const lines = [
        [3000, "Nice job " + progress["username"], "../Pixi/happy.png"],
        [3000, "It's then possible to deal with operation.", "../Pixi/happy.png"],
        [3000, "I'll be waiting for you in the next mission.", "../Pixi/normal.png"],
        [3000, "I would be very happy if you come to see me.", "../Pixi/normal.png"],
    ];
    playAssistantLines(lines);
    unhideThirdPart();
}

function fourthText() {
    document.body.style.background = "url(../Background/river.jpeg)";
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
    unhideFourthPart();
}

main();