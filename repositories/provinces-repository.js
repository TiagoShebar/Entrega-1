import pg from 'pg';
import { DBConfig } from "./dbconfig.js";
import { json } from 'express';
import { makeUpdate } from '../src/utils/functions.js';


export class ProvinceRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async createProvince(province) {
        try {
            const sql = "INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES ($1, $2, $3, $4, $5)"; 
            const values = [province.name, province.full_name, province.latitude, province.longitude, province.display_order? province.display_order : null];
            const respuesta = await this.DBClient.query(sql, values);
            if(respuesta.rowCount === 1){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProvince(id) {
        var sql = "SELECT id from locations WHERE id_province = $1";
        var values = [id];
        const respuesta = await this.DBClient.query(sql,values);
        if(respuesta.rowCount > 0){
            sql = "SELECT id FROM event_locations WHERE id_location = $1";
            values = [respuesta.rows[0].id];
            const eventLocation = await this.DBClient.query(sql, values);
            if(eventLocation.rowCount > 0){
                sql = "UPDATE events SET id_event_location = null WHERE id_event_location = $1";
                values = [eventLocation.rows[0].id];
                const updateEvent = await this.DBClient.query(sql, values);
            }
            sql = "DELETE FROM event_locations WHERE id_location = $1";
            values = [respuesta.rows[0].id];
            const eliminadoEventLocations = await this.DBClient.query(sql, values);
            sql = "DELETE FROM locations WHERE id_province = $1";
            values = [id];
            const eliminadoLocations = await this.DBClient.query(sql, values);
        }
        sql = "DELETE FROM provinces WHERE id = $1";
        const eliminado = await this.DBClient.query(sql,values);
        return eliminado.rowCount > 0;
        
    }

    async updateProvince(province) {
        const [attributes, valuesSet] = makeUpdate(province, {"id": province.id});
        let query;
            if(attributes.length > 0){
                query = `UPDATE provinces SET ${attributes.join(',')} WHERE id = $${valuesSet.length+1}`;
            }
            else{
                query = `SELECT id FROM provinces WHERE id = $${valuesSet.length+1}`
            }
        const values = [...valuesSet, province.id];
        const respuesta = await this.DBClient.query(query,values);
        return respuesta.rowCount;
        
    }

    async getAllProvinces(limit, offset) {
        var sql = "SELECT * FROM provinces limit $1 offset $2";
        const values = [limit, offset*limit];
        const respuesta = await this.DBClient.query(sql, values);

    
        sql = `SELECT COUNT(id) AS total FROM provinces`;
        const totalCount = await this.DBClient.query(sql);

        return [respuesta.rows,totalCount.rows[0].total];
    }   

    async getProvinceById(id) {
        try {
            const sql = "SELECT * FROM provinces WHERE id = $1";
            const values = [id];
            const respuesta = await this.DBClient.query(sql, values);
            return respuesta.rows;
        }
        catch(error){
            console.log(error);
        }
    }

    async getLocationsByProvince(limit,offset,id) {
        var sql = "SELECT id FROM provinces WHERE id = $1";
        var values = [id];
        const existe = await this.DBClient.query(sql, values);

        if(existe.rows.length === 0){
            return [null, 0];
        }
        
        
        sql = "SELECT id, name, id_province, latitude, longitude FROM locations WHERE id_province = $1 LIMIT $2 OFFSET $3";
        values = [id, limit, offset*limit];
        const respuesta = await this.DBClient.query(sql, values);
        sql = `SELECT COUNT(id) AS total FROM locations WHERE id_province = $1`;
        values=[id];
        const totalCount = await this.DBClient.query(sql, values);

        return [respuesta.rows,totalCount.rows[0].total];

        //falta paginacion
    }
}