import {ChangeName, GetInfo, UpdateSuccess} from "./token.js";

let target_city = "the destination"

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
            if (!code.includes("[")) {
                feedback.textContent = "🤔 Maybe you forgot don't know how to use lists ? Try to use the help button.";
            }
            else if (!(code.includes(".append(") || code.includes(".append ("))) {
                feedback.textContent = "🤔 Be sure to use the right methods to add elements ? Try to use the help button.";
            }
            else if (!((code.match(/append/g) || []).length === 8)) {
                feedback.textContent = "🤔 Please listen again to the speech to see what need to be added.";
            }
            else if (!((code.match(/sword/g) || []).length === 1)) {
                feedback.textContent = "🤔 The number of sword is incorrect.";
            }
            else if (!((code.match(/sandwich/g) || []).length === 2)) {
                feedback.textContent = "🤔 The number of sandwich is incorrect. Maybe you miss write it.";
            }
            else if (!((code.match(/training outfit/g) || []).length === 1)) {
                feedback.textContent = "🤔 The number of training outfit is incorrect.";
            }
            else if (!((code.match(/special cake/g) || []).length === 3)) {
                feedback.textContent = "🤔 The number of special cake is incorrect. Maybe you miss write it.";
            }
            else if (!((code.match(/stack of gold coins/g) || []).length === 1)) {
                feedback.textContent = "🤔 The number of stack(s) of gold coins is incorrect. Maybe you miss write it.";
            }
            else if (!(code.includes("print(") || code.includes("print ("))) {
                feedback.textContent = "🤔 Please listen again to the speech to see what need to be added.";
            }
            else if (outputEl.textContent === "") {
                feedback.textContent = "❌ The print was empty, let's try again!";
            }
            else {
                feedback.textContent = "✅ Success! You did everything correctly.";
                secondText()
            }
        },
        function(err) {
            feedback.textContent = "⚠️ Error: " + err.toString();
        }
    );
}

function createLetterList() {
    let res = "letters = ["
    for (const x of Array(26).keys()) {
        res += "'" + String.fromCharCode('a'.charCodeAt(0) + x) + "'";
        if (x < 25) {
            res += ", "
        }
    }
    res += "]\n"
    return res;
}

function runPythonCode2(codeInputId="codeInput2", outputId="consoleOutput2", feedbackId="feedback2") {
    const code = createLetterList() + document.getElementById(codeInputId).value;
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
            const result =  mod.$d.result;
            if (result === undefined) {
                feedback.textContent = "🤔 You are missing the result variable.";
            }
            if ((code.includes("int(") || code.includes("int (")) && code.includes("print") && code.includes("=")
                && code.includes("b =") && outputEl.textContent.includes("<class 'int'>")) {
                feedback.textContent = "✅ Success! You did everything correctly.";
                thirdText()
            }
            if (!code.includes("letters[") && !code.includes("letters [")) {
                feedback.textContent = "🤔 You didn't used the list to create the result string.";
            }
            else if (! (result.v === "rivendell" || result.v === "ironfell" || result.v === "lurelin village" ||result.v === "midport village")) {
                feedback.textContent = "🤔 The result " + result.v + " isn't one of the listed cities. Please use the \"Speech\" button";
            }
            else {
                target_city = result.v; //TODO: use it
                feedback.textContent = "✅ Success! You did everything correctly.";
                thirdText()
            }
        },
        function(err) {
            feedback.textContent = "⚠️ Error: " + err.toString();
        }
    );
}

function defineStart(l) {
    l.push((((Math.floor(Math.random() * 10)) % 3) - 1))
    l.push((((Math.floor(Math.random() * 10)) % 3) - 1))
    l.push((((Math.floor(Math.random() * 10)) % 3) - 1))
    let res = "my_list = ['', '', '']\n"
    res += "inputs = ["
        + (l[0]).toString() + ", "
        + (l[1]).toString() + ", "
        + (l[2]).toString() + "]\n";
    return res
}

function runPythonCode3(codeInputId="codeInput3", outputId="consoleOutput3", feedbackId="feedback3") {
    let l = []
    const code = defineStart(l) + document.getElementById(codeInputId).value;
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
            const zeros = l.filter(function(it){ return it === 0 }).length
            const ones = l.filter(function(it){ return it === 1 }).length
            const m_ones = l.filter(function(it){ return it === -1 }).length
            const final_length = 3 - m_ones + zeros

            const result =  mod.$d.my_list;
            if (result === undefined) {
                feedback.textContent = "🤔 Did you removed the variable my_list ?";
            }
            else if (result.v.length !== final_length) {
                feedback.textContent = "🤔 The output list has an incorrect size.";
            }
            else if (!(code.includes('my_list.remove') || code.includes("my_list.pop"))) {
                feedback.textContent = "🤔 Did you respect the number of minus one ?";
            }
            else if (!(code.includes('print'))) {
                feedback.textContent = "🤔 Did you respect the number of one/minus one ?";
            }
            else if (!(code.includes('my_list.append'))) {
                feedback.textContent = "🤔 Did you respect the number of zero ?";
            }
            else {
                feedback.textContent = "✅ Success! You did everything correctly.";
                fourthText()
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
    UpdateSuccess(7);
    const part = document.getElementById('fourthPart');
    part.classList.remove("hide");
}


function main() {
    const lines = [
        [4000, "Happy to see you again for this new Chapter.", "../Pixi/happy.png"],
        [4500, "Today we will start our journey by packing our staff.", "../Pixi/normal.png"],
        [5000, "You will have to train yourself so you can be able to challenge an old programming master.", "../Pixi/angry.png"],
        [3000, "But for now...", "../Pixi/normal.png"],
        [4000, "Let's start by packing our staff.", "../Pixi/normal.png"],
        [4000, "Make sure you have :", "../Pixi/normal.png"],
        [4000, "- 1 sword", "../Pixi/normal.png"],
        [4000, "- 2 sandwichs", "../Pixi/normal.png"],
        [4000, "- 1 of your training outfit", "../Pixi/normal.png"],
        [4000, "- 3 special ", "../Pixi/normal.png"],
        [4000, "- 1 stack of ৳ (use the name of the money)", "../Pixi/normal.png"]
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

    let exec3 = document.getElementById("runCode3");
    exec3.addEventListener("click", (e) => {
        runPythonCode3();
    });

    let rerun2 = document.getElementById("reRun2");
    rerun2.addEventListener("click", (e) => {
        reRun2();
    });

    let rerun3 = document.getElementById("reRun3");
    rerun3.addEventListener("click", (e) => {
        reRun3();
    });

    let rerun1 = document.getElementById("reRun1");
    rerun1.addEventListener("click", (e) => {
        reRun1();
    });
}

function secondText() {
    const progress = GetInfo();
    const lines = [
        [3000, "Nice job " + progress["username"], "../Pixi/happy.png"],
        [4000, "Now we need to know what will be the first destination.", "../Pixi/normal.png"],
        [4000, "Their is four possible destination where you can begin with :", "../Pixi/normal.png"],
        [4000, "- Rivendell", "../Pixi/normal.png"],
        [4000, "(An elven sanctuary in a valley)", "../Pixi/happy.png"],
        [4000, "- Ironfell", "../Pixi/normal.png"],
        [4000, "(A mystic place in the middle of a moutain, some people say that the dwarfs are living there)", "../Pixi/happy.png"],
        [4000, "- Lurelin Village", "../Pixi/normal.png"],
        [4000, "(A human small fishing village)", "../Pixi/happy.png"],
        [4000, "- Midport Village", "../Pixi/normal.png"],
        [4000, "(A nice and calm village in the plain)", "../Pixi/happy.png"],
        [4000, "Try to select one of these.", "../Pixi/happy.png"]
    ];
    playAssistantLines(lines);
    unhideSecondPart();
}

function thirdText() {
    const progress = GetInfo();
    const lines = [
        [3000, "Nice job " + progress["username"], "../Pixi/happy.png"],
        [4000, "Now we need to know what will be the first destination.", "../Pixi/normal.png"],
        [4000, "Their is four possible destination where you can begin with :", "../Pixi/normal.png"],
        [4000, "- Rivendell", "../Pixi/normal.png"],
        [4000, "(An elven sanctuary in a valley)", "../Pixi/happy.png"],
        [4000, "- Ironfell", "../Pixi/normal.png"],
        [4000, "(A mystic place in the middle of a moutain, some people say that the dwarfs are living there)", "../Pixi/happy.png"],
        [4000, "- Lurelin Village", "../Pixi/normal.png"],
        [4000, "(A human small fishing village)", "../Pixi/happy.png"],
        [4000, "- Midport Village", "../Pixi/normal.png"],
        [4000, "(A nice and calm village in the plain)", "../Pixi/happy.png"],
        [4000, "Try to select one of these.", "../Pixi/happy.png"]
    ];
    playAssistantLines(lines);
    unhideThirdPart();
}

function reRun1() {
    const lines = [
        [4000, "Make sure you have :", "../Pixi/normal.png"],
        [4000, "- 1 sword", "../Pixi/normal.png"],
        [4000, "- 2 sandwichs", "../Pixi/normal.png"],
        [4000, "- 1 of your training outfit", "../Pixi/normal.png"],
        [4000, "- 3 special cakes", "../Pixi/normal.png"],
        [4000, "- 1 stack of ৳ (use the name of the money)", "../Pixi/normal.png"]
    ];
    playAssistantLines(lines);
}

function reRun2() {
    const lines = [
        [4000, "Now we need to know what will be the first destination.", "../Pixi/normal.png"],
        [4000, "Their is four possible destination where you can begin with :", "../Pixi/normal.png"],
        [4000, "- Rivendell", "../Pixi/normal.png"],
        [4000, "(An elven sanctuary in a valley)", "../Pixi/happy.png"],
        [4000, "- Ironfell", "../Pixi/normal.png"],
        [4000, "(A mystic place in the middle of a moutain, some people say that the dwarfs are living there)", "../Pixi/happy.png"],
        [4000, "- Lurelin Village", "../Pixi/normal.png"],
        [4000, "(A human small fishing village)", "../Pixi/happy.png"],
        [4000, "- Midport Village", "../Pixi/normal.png"],
        [4000, "(A nice and calm village in the plain)", "../Pixi/happy.png"],
        [4000, "Try to select one of these.", "../Pixi/happy.png"]
    ];
    playAssistantLines(lines);
}

function reRun3() {
    const lines = [
        [6000, "Ok now, it's time to determine through which city we should pass to got to " + target_city + ".", "../Pixi/happy.png"],
        [3000, "Ok, get ready with the list and follow my steps :", "../Pixi/normal.png"],
        [3000, "I would be very happy if you come to see me.", "../Pixi/normal.png"],
        [10, "", "../Pixi/normal.png"],
    ];
    playAssistantLines(lines);
}



function fourthText() {
    const progress = GetInfo();
    const lines = [
        [3000, "Nice job " + progress["username"], "../Pixi/happy.png"],
        [4000, "Make sure that you understood the lists correctly.", "../Pixi/happy.png"],
        [10, "", "../Pixi/normal.png"],
    ];
    playAssistantLines(lines);
    unhideFourthPart();
}

main();