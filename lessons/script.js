let pyodide;
async function main() {
    pyodide = await loadPyodide();

    // Texte qui apparaît progressivement
    const introLines = [
        [400, "."],
        [500, ". ."],
        [600, ". . ."],
        [700, "He. . ."],
        [1000, "Hel . l . o"],
        [1000, "Hello"],
        [2500, "Can you here me ?"],
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
            // Affiche le challenge quand tous les textes sont apparus
            introText.textContent = "";
            challenge.classList.remove("hidden");
        }
    }
    showNextLine();

    // Exécution du code
    document.getElementById("runCode").addEventListener("click", async () => {
        const code = document.getElementById("codeInput").value;
        const outputEl = document.getElementById("consoleOutput");
        const feedback = document.getElementById("feedback");

        outputEl.textContent = "";
        feedback.textContent = "";

        try {
            // Rediriger stdout/stderr vers JS
            pyodide.setStdout({
                batched: (msg) => { outputEl.textContent += msg; }
            });
            pyodide.setStderr({
                batched: (msg) => { outputEl.textContent += msg; }
            });

            // ⚡ Utiliser runPythonAsync pour supporter stdout
            await pyodide.runPythonAsync(code);

            // Vérification du résultat attendu
            if (outputEl.textContent.trim() === "open") {
                feedback.textContent = "✅ Success, You finally opened your eyes!";
                document.body.classList.add("open");
            } else {
                feedback.textContent = "❌ Oh no, the sentence wasn't correct ..\nYou can use the Help button to get a little help";
            }
        } catch (err) {
            feedback.textContent = "⚠️ You already tried hard things but unfortunately you failed :\n\n" + err;
        }
    });
}
main();
