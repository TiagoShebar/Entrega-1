import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

export class LocationRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    } 
}

//PUNTO 11
/*
export class LocationRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

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