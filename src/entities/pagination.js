export class Pagination {
    static BuildPagination(collection, limit, offset, url, total){
        console.log(url);
        return {
            collection: collection,
            pagination: {
                limit: limit, 
                offset: offset,
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
                nextPageUrl = `${process.env.BASE_URL}${url}&limit=${limit}&offset=${parseInt(offset) + 1}`;
            } else {
                nextPageUrl = `${process.env.BASE_URL}${url}?limit=${limit}&offset=${parseInt(offset) + 1}`;
            }

            // Reemplazar el offset existente en la URL si es necesario
            if (url.includes("offset=")) {
                nextPageUrl = `${process.env.BASE_URL}${url.replace(/(offset=)\d+/, 'offset=' + (parseInt(offset) + 1))}`;
                if (!url.includes("limit=")) {
                    nextPageUrl = nextPageUrl.replace(/(offset=)\d+/, 'limit=' + limit + '&$1' + (parseInt(offset) + 1));
                }
            } else{
                if (url.includes("limit=")) {
                    nextPageUrl = `${process.env.BASE_URL}${url}&offset=${parseInt(offset) + 1}`;
                }
                else{
                    nextPageUrl = `${process.env.BASE_URL}${url}?limit=${limit}&offset=${parseInt(offset) + 1}`;
                }
            } 

            // Verificar si se debe agregar el nextPageUrl basado en la condición
            return nextPageUrl;
        }

    }

    static ParseLimit(limit) {
        return !isNaN(limit) && limit > 0 ? limit : 10;
    }

    static ParseOffset(offset) {
        return !isNaN(offset) ? offset : 0;
    }

    
}