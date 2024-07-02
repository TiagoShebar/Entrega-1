export const verificarObjeto = (obj) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === undefined) {
            return false;
        }
    }
    return true;
}

export const verifyLength = (string) => {
    return string.length >= 3;
}