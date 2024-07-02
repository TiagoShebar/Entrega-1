//PUNTO 13, fijarse si funciona y si se ejcuta en algun momento
import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

export class EventLocationRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getAllEventLocations(userId, limit, offset) {
        let query = `SELECT * FROM event_locations WHERE id_creator_user = $1 LIMIT $2 OFFSET $3`;
        const result = await this.DBClient.query(query, [userId, limit, offset*limit]);

        query = "SELECT COUNT(id) AS total FROM event_locations WHERE id_creator_user = $1";
        const totalCount = await this.DBClient.query(query, [userId]);

        return [result.rows, totalCount.rows[0].total];
    }

    async getEventLocationById(id, userId) {
        const query = `SELECT * FROM event_locations WHERE id = $1 AND id_creator_user = $2`;
        const result = await this.DBClient.query(query, [id, userId]);
        return result.rows[0];
    }

    async createEventLocation(eventLocation) {
        let query = "SELECT * FROM locations WHERE id = $1";
        const existeLocation = await this.DBClient.query(query, [eventLocation.id_location]);
        if(existeLocation.rowCount > 0){
            query = `INSERT INTO event_locations (id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
            const result = await this.DBClient.query(query, [eventLocation.id_location, eventLocation.name, eventLocation.full_address, eventLocation.max_capacity, eventLocation.latitude, eventLocation.longitude, eventLocation.id_creator_user]);
            return (result.rowCount > 0);
        }
        else{
            return false;
        }
        
    }

    async updateEventLocation(eventLocation) {
        let query = "SELECT * FROM locations WHERE id = $1";
        const existeLocation = await this.DBClient.query(query, [eventLocation.id_location]);
        if(existeLocation.rowCount > 0){
            query = "SELECT * FROM event_locations WHERE id=$1 AND id_creator_user=$2";
            const existeEventLocation = await this.DBClient.query(query, [eventLocation.id, eventLocation.id_creator_user]);
            if(existeEventLocation.rowCount > 0){
                query = `UPDATE event_locations SET id_location = $1, name = $2, full_address = $3, max_capacity = $4, latitude = $5, longitude = $6 WHERE id = $7 AND id_creator_user = $8`;
                const result = await this.DBClient.query(query, [eventLocation.id_location, eventLocation.name, eventLocation.full_address, eventLocation.max_capacity, eventLocation.latitude, eventLocation.longitude, eventLocation.id, eventLocation.id_creator_user]);
                return [200, null];
            }
            else{
                return [404, "el id del event_location es inexistente o no pertenece al usuario autenticado."];
            }
        }
        else{
            return [400, "El id_location es inexistente"];
        }
        
        
    }

    async deleteEventLocation(id, userId) {
        const query = `DELETE FROM event_locations WHERE id = $1 AND id_creator_user = $2`;
        const result = await this.DBClient.query(query, [id, userId]);
        return result.rowCount > 0;
    }
}
