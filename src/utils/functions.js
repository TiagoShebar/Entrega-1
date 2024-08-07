export const verifyLength = (string) => {
    return String(string).length >= 3;
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

export const makeUpdate = (obj, objNO) => {
    const attributes = [];
    const values = [];
    let i = 1;
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== undefined && !objNO.hasOwnProperty(key)) {
            attributes.push(`${key} = $${i}`);
            values.push(obj[key]);
            i++;
        }
    }
    return [attributes,values];
}