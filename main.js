function register(itemName, itemValue) {
    localStorage.setItem(itemName, itemValue);
}

function extractor(itemName) {
    return localStorage.getItem(itemName);
}

function remover(itemName) {
    return localStorage.removeItem(itemName);
}

// Encode en base64url (pour JWT)
function base64urlEncode(obj) {
    return btoa(JSON.stringify(obj))
        .replace(/=+$/, "")     // Supprime les '=' en fin
        .replace(/\+/g, "-")    // Remplace + par -
        .replace(/\//g, "_");   // Remplace / par _
}

// Decode du base64url
function base64urlDecode(str) {
    // Remet en base64 normal
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    // Ajoute padding si besoin
    while (str.length % 4) {
        str += "=";
    }
    return JSON.parse(atob(str));
}

function encode(payload) {
    const header = { alg: "none", typ: "JWT" };
    const encodedHeader = base64urlEncode(header);
    const encodedPayload = base64urlEncode(payload);
    return `${encodedHeader}.${encodedPayload}.`; // Pas de signature
}

function decode(token) {
    const parts = token.split(".");
    if (parts.length < 2) throw new Error("Token invalide");
    return base64urlDecode(parts[1]); // On lit le payload
}

function CheckJwt(){
    let progress = null
    let jwt = extractor("progressData");
    if (jwt != null) {
        try {
            progress = decode(jwt);
        }
        catch (error) {
            progress = null;
            remover("progressData");
            jwt = null;
        }
    }
    if (progress == null) {
        const now = Math.floor(Date.now() / 1000);
        const exp = now + 10 * 24 * 60 * 60;
        const start = {
            timestamp: Date.now(),
            lostDate: exp,
            status: 1,
        }
        const token = encode(start);
        register("progressData", token);
        return start;
    }
    else {
        const now = Math.floor(Date.now() / 1000);
        const exp = now + 10 * 24 * 60 * 60;
        if (progress.lostDate < Math.floor(Date.now() / 1000)) {
            const start = {
                timestamp: Date.now(),
                lostDate: exp,
                status: 1,
            }
            if (Object.hasOwn(progress, "username")) {
                start["username"] = progress["username"];
            }
            const token = encode(start);
            register("progressData", token);
            return start;
        }
        const progress2 = {
            timestamp: Date.now(),
            lostDate: exp,
            status: progress.status,
        }
        if (Object.hasOwn(progress, "username")) {
            progress2["username"] = progress["username"];
        }
        const token = encode(progress2);
        register("progressData", token);
        return progress2;
    }
}

function checkStatus(progress){
    if (progress.status <= 1) {
        window.location = "startingPage.html"
    }
}

function checkRequiered(needed){
    progress = CheckJwt();
    return progress.status >= needed;
}

function unlockHelp(progress) {
    if (progress.status >= 4) {
        const part = document.getElementById('Help');
        part.classList.remove("hide");
    }
    if (progress.status === 4) {
        const part = document.getElementById('bot');
        part.classList.remove("hide");

        lines = [
            [4000, "Nice to see you " + progress.username, "../Pixi/happy.png"],
            [8000, "You just unlocked the help menu if you need any help in without doing the missions again.", "Pixi/normal.png"]
        ];
        playAssistantLines(lines)
    }
    if (progress.status > 4) {
        const part = document.getElementById('bot');
        part.classList.remove("hide");

        lines = [
            [6000, "Nice to see you " + progress.username, "Pixi/happy.png"],
            [10, "", "Pixi/normal.png"]
        ];
        playAssistantLines(lines)
    }
}

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

function main() {
    const progress = CheckJwt();
    console.log(progress);
    checkStatus(progress);
    unlockHelp(progress);
}

main()