"use strict";
import {UpdateSuccess} from "./token.js";

// Fonction de lecture des fichiers builtins de Skulpt
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
        throw "File not found: '" + x + "'";
    }
    return Sk.builtinFiles["files"][x];
}

function playAssistantLines() {
    const challenge = document.getElementById("backButtonHidden");
    const lines = [
        [2000, "Oh !", "../Pixi/normal.png"],
        [2000, "Hi again.", "../Pixi/normal.png"],
        [2000, "You are finally awake !", "../Pixi/happy.png"],
        [3000, "My name is Pixi, but you can call me ...", "../Pixi/normal.png"],
        [2000, ".", "../Pixi/fool.png"],
        [2000, ". .", "../Pixi/fool.png"],
        [2000, ". . .", "../Pixi/fool.png"],
        [4000, "Pixi", "../Pixi/happy.png"],
        [2000, "hm hm ..", "../Pixi/normal.png"],
        [4000, "So, I'll be your assistant in this new world.", "../Pixi/happy.png"],
        [5000, "For every action you'll have to write python code in this world remember ?", "../Pixi/happy.png"],
        [2000, "Good", "../Pixi/normal.png"],
        [5000, "If you have everything in mind, let's continue the trip. Right ?", "../Pixi/happy.png"],
        [10, "", "../Pixi/normal.png"],
    ];
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
        else {
            UpdateSuccess(2);
            challenge.classList.remove("hidden");
        }
    }

    showNextLine();
}

async function main() {
    // Texte qui apparaît progressivement
    const introLines = [
        [400, "."],
        [500, ". ."],
        [600, ". . ."],
        [700, "He. . ."],
        [1000, "Hel . l . o"],
        [1000, "Hello"],
        [2500, "Can you hear me ?"],
        [2000, "Oh !!"],
        [2000, "Finally awake ?"],
        [3000, "I think it'll be better if you could open your eyes first."],
        [2000, "Let me help you"],
        [3000, "In this world, every interaction must be made with python."],
        [6000, "In programming, it will be very useful for you to display text or elements on the computer."],
        [3000, "This is what I call your eye."],
        [3000, "It brings information to your human brain."],
        [4000, "To do this, you must write a new instruction using the print function!"],
        [3000, "Each line of code is an order that you give to the computer."]
    ];

    const introText = document.getElementById("introText");
    const challenge = document.getElementById("codeChallenge");

    let i = 0;
    function showNextLine() {
        if (i < introLines.length) {
            introText.textContent = introLines[i][1];
            requestAnimationFrame(() => introText.classList.add("show"));
            i++;
            setTimeout(showNextLine, introLines[i - 1][0]);
        } else {
            introText.textContent = "";
            challenge.classList.remove("hidden");
        }
    }
    showNextLine();

    // Variable d'étape (1er ou 2e challenge)
    let step = 1;
    let speech = new SpeechSynthesisUtterance();
    speech.text = "hello";
    window.speechSynthesis.speak(speech);

    // Exécution du code avec Skulpt
    document.getElementById("runCode").addEventListener("click", () => {
        const code = document.getElementById("codeInput").value;
        const outputEl = document.getElementById("consoleOutput");
        const feedback = document.getElementById("feedback");

        outputEl.textContent = "";
        feedback.textContent = "";

        Sk.configure({
            output: function (text) {
                outputEl.textContent += text;
            },
            read: builtinRead,
            inputfunTakesPrompt: true,
            execLimit: 10000,
            killableWhile: true,
            killableFor: true,
        });

        // Lance le code Python
        var myPromise = Sk.misceval.asyncToPromise(function () {
            return Sk.importMainWithBody("<stdin>", false, code, true);
        });

        myPromise.then(
            function () {
                const result = outputEl.textContent.trim();

                if (step === 1 && result === "open") {
                    feedback.textContent = "✅ Good! But it seems harder than that...";
                    // reset console + input
                    outputEl.textContent = "";
                    document.getElementById("codeInput").value = "";
                    // demander le nouveau challenge
                    setTimeout(() => {
                        feedback.textContent = ""
                        let description = document.getElementById("programDescription");
                            description.textContent = "Now try again, but this time print:\n\n\"I really want to open them\"";
                        step = 2;
                    }, 1200);
                } else if (step === 2 && result === "I really want to open them") {
                    feedback.textContent = "✅ Perfect... Your eyes are opening!";
                    document.body.classList.add("open");
                    playAssistantLines()
                } else {
                    feedback.textContent =
                        "❌ Not quite right... Try again!";
                }
            },
            function (err) {
                feedback.textContent =
                    "⚠️ Error:\n\n" + err.toString();
            }
        );
    });
}
main();
