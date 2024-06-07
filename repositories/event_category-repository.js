import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

export class EventCategoryRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }
}
// PUNTO 12
/*
    async getEventCategory(limit, offset) {
        const query = `SELECT * FROM event_categories LIMIT $1 OFFSET $2`;
        const result = await this.DBClient.query(query, [limit, offset]);
        const totalCount = result.rowCount;
        return [result.rows, totalCount];
    }

    async getEventCategoryById(id) {
        const query = `SELECT * FROM event_categories WHERE id = $1`;
        const result = await this.DBClient.query(query, [id]);
        return result.rows[0];
    }

    async createEventCategory(eventCategory) {
        const { name, display_order } = eventCategory;
        const query = `INSERT INTO event_categories (name, display_order) VALUES ($1, $2) RETURNING *`;
        const result = await this.DBClient.query(query, [name, display_order]);
        return result.rows[0];
    }

    async updateEventCategory(eventCategory) {
        const { id, name, display_order } = eventCategory;
        const query = `UPDATE event_categories SET name = $1, display_order = $2 WHERE id = $3 RETURNING *`;
        const result = await this.DBClient.query(query, [name, display_order, id]);
        return result.rows[0];
    }

    async deleteEventCategory(id) {
        const query = `DELETE FROM event_categories WHERE id = $1 RETURNING *`;
        const result = await this.DBClient.query(query, [id]);
        return result.rows[0];
    }
}

*/