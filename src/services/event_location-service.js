//PUNTO 13, fijarse si funciona y si se ejcuta en algun momento
import { EventLocationRepository } from "../../repositories/event_location-repository.js";
import { Pagination } from "../entities/pagination.js"

export class EventLocationService {
    constructor() {
        this.eventLocationRepository = new EventLocationRepository();
    }

    async getAllEventLocations(userId, limit, offset, url) {
        const [eventLocations,totalCount] = await this.eventLocationRepository.getAllEventLocations(userId, limit, offset);
        return Pagination.BuildPagination(eventLocations, limit, offset, url, totalCount);
    }

    async getEventLocationById(id, userId) {
        return await this.eventLocationRepository.getEventLocationById(id, userId);
    }

    async createEventLocation(eventLocation) {
        // Implementa las validaciones necesarias antes de crear la ubicación del evento
        return await this.eventLocationRepository.createEventLocation(eventLocation);
    }

    async updateEventLocation(eventLocation) {
        // Implementa las validaciones necesarias antes de actualizar la ubicación del evento
        return await this.eventLocationRepository.updateEventLocation(eventLocation);
    }

    async deleteEventLocation(id, userId) {
        return await this.eventLocationRepository.deleteEventLocation(id, userId);
    }
}
