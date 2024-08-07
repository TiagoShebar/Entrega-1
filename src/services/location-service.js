import { query } from "express";
import { LocationRepository } from "../../repositories/locations-repository.js";
import { Pagination } from "../entities/pagination.js"

export class LocationService {
    constructor() {
        this.bd = new LocationRepository();
    }

    async getAllLocations(offset, limit, url){
        const [locations,totalCount] = await this.bd.getAllLocations(limit, offset);
        return Pagination.BuildPagination(locations, limit, offset, url, totalCount);
    }

    async getLocationById(id){
        const location = await this.bd.getLocationById(id);
        return location;
    }

    async getEventLocationsByIdLocation(limit, offset, url, id){
        const [event_locations, totalCount] = await this.bd.getEventLocationsByLocationId(limit, offset, id);
        return totalCount === null ? false : Pagination.BuildPagination(event_locations, limit, offset, url, totalCount);
    }
}

//PUNTO 11
/*
    async getLocationById(id) {
        return await this.locationRepository.getLocationById(id);
    }

    async getEventLocationsByLocationId(locationId) {
        return await this.locationRepository.getEventLocationsByLocationId(locationId);
    }
}
*/