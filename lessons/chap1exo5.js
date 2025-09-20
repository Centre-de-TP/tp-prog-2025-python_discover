import {ChangeName, GetInfo, UpdateSuccess} from "./token.js";
import {ChangeData, GetPlayerData} from "./playerData.js";

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
    const code = "price = 10\n" + "golden_price = 2004\n" + document.getElementById(codeInputId).value;
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
            const money =  mod.$d.money;
            if (money === undefined) {
                feedback.textContent = "🤔 You are missing the money variable.";
            }
            else {
                const m = money.v;

                if (code.includes("input") && code.includes("print")) {
                    if (m >= 10 && outputEl.includes("You bought some bananas")
                        || m < 10 && outputEl.includes("You had not enough money to buy bananas")) {
                        feedback.textContent = "✅ Success! You did everything correctly.";
                        secondText()
                    }
                    else {
                        feedback.textContent = "🤔 You may have not print the right thing.";
                    }
                }
                else if (!code.includes("input(") && !code.includes("input (")) {
                    feedback.textContent = "🤔 You are not asking anything.";
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
    const variableDeclaration = "expensive_Restaurant = 1000\n" + "common_Restaurant = 50\n"
        + "nearby_Store = 20\n" + "expensive_Hotel = 100000\n" + "common_house = 50000\n"
        + "expensive_house = 500500\n" + "clothing_store = 500\n" + "money = 500520\n"
    const code = variableDeclaration + document.getElementById(codeInputId).value;
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
            if (!code.includes("print")) {
                feedback.textContent = "❌ A print was used in the code.";
            }
            else {
                const variableDeclaration = "expensive_Restaurant = 1000\n" + "common_Restaurant = 50\n"
                    + "nearby_Store = 20\n" + "expensive_Hotel = 100000\n" + "common_house = 50000\n"
                    + "expensive_house = 500500\n" + "clothing_store = 500\n" + "money = 500520\n"
                let result =  mod.$d.result;
                if (result === undefined) {
                    feedback.textContent = "❌ You are missing the result variable.";
                }
                else {
                    result = result.v;

                    const money = 500520;
                    let resto = false;
                    let accommodation = false;
                    let rest = money
                    if (result.includes("expensive_Restaurant")) {
                        rest = rest - 1000
                        resto = true;
                    }
                    if (result.includes("common_Restaurant")) {
                        rest = rest - 50
                        resto = true;
                    }
                    if (result.includes("nearby_Store")) {
                        rest = rest - 20
                        resto = true;
                    }
                    if (result.includes("expensive_Hotel")) {
                        rest = rest - 100000
                        accommodation = true;
                    }
                    if (result.includes("common_house")) {
                        rest = rest - 50000
                        accommodation = true;
                    }
                    if (result.includes("expensive_house")) {
                        rest = rest - 500500
                        accommodation = true;
                    }
                    if (result.includes("clothing_store")) {
                        rest = rest - 500
                        ChangeData("outfit", 15)
                    }
                    if (rest >= money) {
                        feedback.textContent = "🤔 Are you trying to trick us ?";
                    }
                    else if (rest < 0) {
                        feedback.textContent = "🤔 You can't afford having to much things, it' to expensive.";
                    }
                    else if (!accommodation || !resto) {
                        feedback.textContent = "🤔 You could fill the needs you had.";
                    }

                    else if (code.includes("money")) {
                        feedback.textContent = "✅ Success! You did everything correctly.";
                        thirdText()
                    } else {
                        feedback.textContent = "❌ The code wasn't correct. Let's try again!";
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
    UpdateSuccess(6);
    const part = document.getElementById('thirdPart');
    part.classList.remove("hide");
}


function main() {
    const lines = [
        [2000, "Hey !", "../Pixi/happy.png"],
        [3000, "Ready to finish the first chapter ?", "../Pixi/normal.png"],
        [3500, "Ok, let me do a recap on the situation.", "../Pixi/normal.png"],
        [3500, "You managed to survive and we left the forest.", "../Pixi/happy.png"],
        [4500, "In front of you there is the city of Thalewood.", "../Pixi/normal.png"],
        [3000, "But....", "../Pixi/sad.png"],
        [5000, "The guards don't want to let you enter the city with these cloths.", "../Pixi/angry.png"],
        [5000, "There is still this guy who wants to sell you bananas.", "../Pixi/fool.png"],
        [5000, "He said that if you could afford one banana, he would show you how to enter !", "../Pixi/fool.png"],
        [1, "", "../Pixi/normal.png"],
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
        [3000, "Ok nice !!", "../Pixi/happy.png"],
        [6000, "He took the banana back but we managed to knock him out and enter the city.", "../Pixi/happy.png"],
        [4000, "Now, let's find somewhere to eat and rest.", "../Pixi/normal.png"],
    ];
    playAssistantLines(lines);
    unhideSecondPart();
}

function thirdText() {
    const progress = GetInfo();
    const lines = [
        [3000, "Nice job " + progress["username"], "../Pixi/happy.png"],
        [4000, "The final level of the chapter 1 is complete !!.", "../Pixi/happy.png"],
        [4000, "I think it's time to begin a new trip.", "../Pixi/normal.png"],
    ];
    playAssistantLines(lines);
    unhideThirdPart();
}

main();