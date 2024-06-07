import { query } from "express";
import { LocationRepository } from "../../repositories/locations-repository.js";

export class LocationService {
    constructor() {
        this.bd = new LocationRepository();
    }


}

//PUNTO 11
/*
export class LocationService {
    constructor() {
        this.locationRepository = new LocationRepository();
    }

    async getLocationById(id) {
        return await this.locationRepository.getLocationById(id);
    }

    async getEventLocationsByLocationId(locationId) {
        return await this.locationRepository.getEventLocationsByLocationId(locationId);
    }
}

*/