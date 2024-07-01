import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

export class LocationRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    } 

    async getAllLocations(limit, offset) {
        var query = "SELECT * FROM locations LIMIT $1 OFFSET $2";
        const values = [limit, offset*limit];
        const result = await this.DBClient.query(query, values);
        query = `SELECT COUNT(id) AS total FROM locations`;
        const totalCount = await this.DBClient.query(query);
        return [result.rows,totalCount.rows[0].total];
    }

    async getLocationById(id) {
        const query = "SELECT * FROM locations WHERE id = $1";
        const result = await this.DBClient.query(query, [id]);
        return result.rows[0];
    }

    async getEventLocationsByLocationId(limit, offset, id){
        var query = "SELECT id FROM locations WHERE id = $1";
        var values = [id];
        const result = await this.DBClient.query(query, values);
        if(result.rowCount > 0){
            query = "SELECT * FROM event_locations WHERE location_id = $1 LIMIT $2 OFFSET $3";
            values = [id, limit, offset*limit];
            const result = await this.DBClient.query(query, values);
            query = `SELECT COUNT(id) FROM event_locations WHERE location_id = $1 GROUP BY id`;
            const totalCount = await this.DBClient.query(query, values);
            return [result.rows,totalCount.rows.length];
        }
        else{
            return [null, -1];
        }
    }
}

//PUNTO 11
/*
    async getLocationById(id) {
        const query = "SELECT * FROM locations WHERE id = $1";
        const result = await this.DBClient.query(query, [id]);
        return result.rows[0];
    }

    async getEventLocationsByLocationId(locationId) {
        const query = "SELECT * FROM event_locations WHERE location_id = $1";
        const result = await this.DBClient.query(query, [locationId]);
        return result.rows;
    }
}

*/