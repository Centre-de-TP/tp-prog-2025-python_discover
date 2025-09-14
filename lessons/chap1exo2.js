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
            // Vérifie si la sortie est "open" pour ton exo
            if (code.includes("input(") && code.includes("lastname") && code.includes("firstname")) {
                feedback.textContent = "✅ Success! You asked everything.";
                secondText()
                //TODO launch second text
            }
            else if (!code.includes("input")) {
                feedback.textContent = "🤔 You are not asking anything.";
            }
            else if (!code.includes("lastname") || !code.includes("firstname")) {
                feedback.textContent = "🤔 You are missing the firstname or the lastname.";
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


function main() {
    const lines = [
        [2000, "Oh hello there", "../Pixi/normal.png"],
        [2500, "At least you haven't quit yet.", "../Pixi/happy.png"],
        [1500, "But...", "../Pixi/normal.png"],
        [2000, "I just remembered something..", "../Pixi/happy.png"],
        [3000, "I don't think I really know you", "../Pixi/sad.png"],
        [3000, "Who are you again ?", "../Pixi/sad.png"],
        [10, "", "../Pixi/normal.png"]
    ];
    playAssistantLines(lines);
}

function secondText() {
    const lines = [
        [1000, "Now I remember.", "../Pixi/happy.png"],
        [4000, "I hope I won't forget your name know that you told me.", "../Pixi/angry.png"],
        [3000, "But let's go further in this mission.", "../Pixi/normal.png"],
        [3000, "I'm not sure your ears work properly.", "../Pixi/happy.png"],
        [3000, "Let's say your name again and hear it.", "../Pixi/happy.png"],
        [2000, "Who are you again ?", "../Pixi/normal.png"]
    ];
    playAssistantLines(lines);
}

main();