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

import { Pagination } from "../entities/pagination.js";
export const verifyPaginationResources = (limit, page) => {
    limit = Pagination.ParseLimit(limit);
    if(limit === false){
        return "Limit mal ingresado";
    }
    page = Pagination.ParsePage(page);
    if(page === false){
        return "Page mal ingresado";
    }
    return [limit, (page-1)];
}