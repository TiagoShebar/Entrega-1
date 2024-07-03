export class Pagination {
    static BuildPagination(collection, limit, offset, url, total){
        return {
            collection: collection,
            pagination: {
                limit: limit, 
                page: offset+1,
                nextPage: (parseInt(offset) + 1)*limit < total ? this.BuildNextPage(limit, offset, url) : null,
                total: total
            }


            //offset+1*limit menor / menor o igual al total?
        };
        
    }

    static BuildNextPage(limit, offset, url){
        // Suponiendo que tienes definido process.env.BASE_URL y las variables limit, offset y total

        if (offset !== null && offset !== undefined && parseInt(offset) >= 0) {
            // Construir la parte de la URL para el siguiente offset
            let nextPageUrl;

            // Verificar si la URL original ya tiene parámetros
            if (url.includes("?")) {
                nextPageUrl = `${process.env.BASE_URL}${url}&limit=${limit}&page=${parseInt(offset) + 2}`;
            } else {
                nextPageUrl = `${process.env.BASE_URL}${url}?limit=${limit}&page=${parseInt(offset) + 2}`;
            }

            // Reemplazar el offset existente en la URL si es necesario
            if (url.includes("page=")) {
                nextPageUrl = `${process.env.BASE_URL}${url.replace(/(page=)\d+/, 'page=' + (parseInt(offset) + 2))}`;
                if (!url.includes("limit=")) {
                    nextPageUrl = nextPageUrl.replace(/(page=)\d+/, 'limit=' + limit + '&$1' + (parseInt(offset) + 2));
                }
            } else{
                if (url.includes("limit=")) {
                    nextPageUrl = `${process.env.BASE_URL}${url}&page=${parseInt(offset) + 2}`;
                }
                else{
                    nextPageUrl = `${process.env.BASE_URL}${url}?limit=${limit}&page=${parseInt(offset) + 2}`;
                }
            } 

            // Verificar si se debe agregar el nextPageUrl basado en la condición
            return nextPageUrl;
        }

    }

    static ParseLimit(limit) {
        if(limit === undefined){
            limit = 10;
        }
        else if(isNaN(limit) || limit <= 0){
            return false;
        }
        return limit;
    }

    static ParsePage(page) {  
        if(page === undefined){
           page = 1; 
        }
        else if(isNaN(page) || page <= 0){ 
            return false;
        }
        return page;
    }

    
}