import { query } from "express";
import { ProvinceRepository } from "../../repositories/provinces-repository.js";
import { Pagination } from "../entities/pagination.js"

export class ProvincesService{
    constructor() {
        this.bd = new ProvinceRepository();
    }
    
    async createProvince(province){
        const [verificacion,mensaje] = this.verificarProvince(province);
        if(verificacion){
            const resultado = await this.bd.createProvince(province);
            return [resultado, null];
        }
        else{
            return [false,mensaje];
        }
    }

    async updateProvince(province){
        const [verificacion,mensaje] = this.verificarProvince(province);
        if(verificacion){
            const resultado = await this.bd.updateProvince(province);
            if(resultado > 0){
                return [true,null];
            }
            else{
                return [false,null];
            }
        }
        else{
            return [false, mensaje];
        }
        
    }

    verificarProvince(province){
        if(province.name !== undefined && province.name.length < 3){
            return [false, "El campo name está vacío o tiene menos de tres (3) letras."];
        }
        else if(province.latitude !== undefined && isNaN(province.latitude) || province.longitude !== undefined && isNaN(province.longitude)){
            return [false, "Los campos latitude y longitude no son números."];
        }
        else{
            return [true,null];
        }
    }

    async deleteProvince(id){
        const eliminado = await this.bd.deleteProvince(id);
        return eliminado;
    }

    async getAllProvinces(limit, offset, url){
        const [provinces,totalCount] = await this.bd.getAllProvinces(limit, offset);
        return Pagination.BuildPagination(provinces, limit, offset, url, totalCount);
    }

    async getProvinceById(id){
        const resultado = await this.bd.getProvinceById(id);
        return resultado;
    }

    async getLocationsByProvinceId(limit, offset, url, id){
        const [locations,totalCount] = await this.bd.getLocationsByProvince(limit, offset, id);
        if(locations === null){
            return null;
        }
        return Pagination.BuildPagination(locations, limit, offset, url, totalCount);
    }
}