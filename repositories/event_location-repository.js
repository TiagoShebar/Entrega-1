//PUNTO 13, fijarse si funciona y si se ejcuta en algun momento
import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

export class EventLocationRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getAllEventLocations(userId) {
        const query = `SELECT * FROM event_locations WHERE id_creator_user = $1`;
        const result = await this.DBClient.query(query, [userId]);
        return result.rows;
    }

    async getEventLocationById(id, userId) {
        const query = `SELECT * FROM event_locations WHERE id = $1 AND id_creator_user = $2`;
        const result = await this.DBClient.query(query, [id, userId]);
        return result.rows[0];
    }

    async createEventLocation(eventLocation) {
        const { name, full_address, id_location, max_capacity, id_creator_user } = eventLocation;
        const query = `INSERT INTO event_locations (name, full_address, id_location, max_capacity, id_creator_user) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await this.DBClient.query(query, [name, full_address, id_location, max_capacity, id_creator_user]);
        return result.rows[0];
    }

    async updateEventLocation(eventLocation) {
        const { id, name, full_address, id_location, max_capacity, id_creator_user } = eventLocation;
        const query = `UPDATE event_locations SET name = $1, full_address = $2, id_location = $3, max_capacity = $4 WHERE id = $5 AND id_creator_user = $6 RETURNING *`;
        const result = await this.DBClient.query(query, [name, full_address, id_location, max_capacity, id, id_creator_user]);
        return result.rows[0];
    }

    async deleteEventLocation(id, userId) {
        const query = `DELETE FROM event_locations WHERE id = $1 AND id_creator_user = $2 RETURNING *`;
        const result = await this.DBClient.query(query, [id, userId]);
        return result.rows[0];
    }
}
