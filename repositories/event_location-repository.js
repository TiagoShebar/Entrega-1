//PUNTO 13, fijarse si funciona y si se ejcuta en algun momento
import pg from 'pg';
import { DBConfig } from "./dbconfig.js";
import { makeUpdate } from '../src/utils/functions.js';

export class EventLocationRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getAllEventLocations(limit, offset) {
        let query = `SELECT * FROM event_locations LIMIT $1 OFFSET $2`;
        const result = await this.DBClient.query(query, [limit, offset*limit]);

        query = "SELECT COUNT(id) AS total FROM event_locations";
        const totalCount = await this.DBClient.query(query);

        return [result.rows, totalCount.rows[0].total];
    }

    async getEventLocationById(id) {
        const query = `SELECT * FROM event_locations WHERE id = $1`;
        const result = await this.DBClient.query(query, [id]);
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
            let query = "SELECT * FROM event_locations WHERE id=$1";
            const existeEventLocation = await this.DBClient.query(query, [eventLocation.id]);
            if(existeEventLocation.rowCount > 0){
                    const [attributes, valuesSet] = makeUpdate(eventLocation, {"id": eventLocation.id});
                    if(attributes.length > 0){
                        query = `UPDATE event_locations SET ${attributes.join(',')} WHERE id = $${valuesSet.length+1}`;
                        const result = await this.DBClient.query(query, [...valuesSet, eventLocation.id]);
                    }
                    return [200, null];
                
            }
    }
        

    async deleteEventLocation(id, userId) {
        const query = `DELETE FROM event_locations WHERE id = $1 AND id_creator_user = $2`;
        const result = await this.DBClient.query(query, [id, userId]);
        return result.rowCount > 0;
    }
}
