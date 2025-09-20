import {GetInfo} from "../token.js";
const info = GetInfo();

if (info.status >= 5) {
    const obj1 = document.getElementById("operation");
    obj1.classList.remove("hide");
}

if (info.status >= 6) {
    const obj2 = document.getElementById("condition");
    obj2.classList.remove("hide");
}