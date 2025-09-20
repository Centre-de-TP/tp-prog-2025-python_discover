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

export function ChangeData(name, value){
    let playerData = null
    let jwt = extractor("playerData");
    if (jwt != null) {
        try {
            playerData = decode(jwt);
        }
        catch (error) {
            playerData = null;
            remover("playerData");
            jwt = null;
        }
    }
    if (playerData == null) {
        const progress = GetInfo();
        playerData = {
            username: progress.name
        }
    }
    playerData[name] = value
    const token = encode(playerData);
    register("playerData", token);
    return playerData;
}

export function GetPlayerData(){
    let playerData = null
    let jwt = extractor("playerData");
    if (jwt != null) {
        try {
            playerData = decode(jwt);
        }
        catch (error) {
            playerData = null;
            remover("playerData");
            jwt = null;
        }
    }
    if (playerData == null) {
        return null;
    }
    else {
        return playerData;
    }
}
