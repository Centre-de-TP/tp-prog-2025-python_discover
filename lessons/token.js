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

export function UpdateSuccess(i){
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
            status: i > 0 ? i : 1,
        }
        const token = encode(start);
        register("progressData", token);
        return start;
    }
    else {
        if (progress.lostDate < Math.floor(Date.now() / 1000)) {
            const start = {
                timestamp: progress.timestamp,
                lostDate: progress.lostDate,
                status: (i > progress.status) ? i : progress.status,
            }
            if (Object.hasOwn(progress, "username")) {
                start["username"] = progress["username"];
            }
            const token = encode(start);
            register("progressData", token);
            return start;
        }
        const progress2 = {
            timestamp: progress.timestamp,
            lostDate: progress.lostDate,
            status: (i > progress.status) ? i : progress.status,
        }
        if (Object.hasOwn(progress, "username")) {
            progress2["username"] = progress["username"];
        }
        const token = encode(progress2);
        register("progressData", token);
        return progress2;
    }
}

export function ChangeName(name){
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
            username: name
        }
        const token = encode(start);
        register("progressData", token);
        return start;
    }
    else {
        if (progress.lostDate < Math.floor(Date.now() / 1000)) {
            const start = {
                timestamp: progress.timestamp,
                lostDate: progress.lostDate,
                status: progress.status,
                username: name
            }
            const token = encode(start);
            register("progressData", token);
            return start;
        }
        const progress2 = {
            timestamp: progress.timestamp,
            lostDate: progress.lostDate,
            status: progress.status,
            username: name
        }
        const token = encode(progress2);
        register("progressData", token);
        return progress2;
    }
}

export function GetInfo(){
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
        return null;
    }
    else {
        return progress;
    }
}
