//PUNTO 13, fijarse si funciona y si se ejcuta en algun momento
import { EventLocationRepository } from "../../repositories/event_location-repository.js";
import { Pagination } from "../entities/pagination.js"
import { verifyLength } from "../utils/functions.js";

export class EventLocationService {
    constructor() {
        this.eventLocationRepository = new EventLocationRepository();
    }

    async getAllEventLocations(limit, offset, url) {
        const [eventLocations,totalCount] = await this.eventLocationRepository.getAllEventLocations(limit, offset);
        return Pagination.BuildPagination(eventLocations, limit, offset, url, totalCount);
    }

    async getEventLocationById(id) {
        const eventLocation = await this.eventLocationRepository.getEventLocationById(id);
        return eventLocation;
    }

    async createEventLocation(eventLocation) {
        // Implementa las validaciones necesarias antes de crear la ubicación del evento
        let creation = this.verifyEventLocation(eventLocation);
        if(creation === true){
            creation = await this.eventLocationRepository.createEventLocation(eventLocation);
        }
        return creation;
        
    }

    verifyEventLocation(eventLocation){
        if(!verifyLength(eventLocation.name) || !verifyLength(eventLocation.full_address)){
            return "El nombre  (name) o la dirección (full_address) están vacíos o tienen menos de tres (3) letras";
        }
        else if(eventLocation.max_capacity <= 0){
            return "El max_capacity es el número 0 (cero) o negativo";
        }
        else{
            return true;
        }
    }

    async updateEventLocation(eventLocation) {
        let message = this.verifyEventLocation(eventLocation);
        let statusCode;
        if(message === true){
            [statusCode, message] = await this.eventLocationRepository.updateEventLocation(eventLocation);
            return [statusCode, message];
        }
        return [400, message];
    }

    async deleteEventLocation(id, userId) {
        const deleted = await this.eventLocationRepository.deleteEventLocation(id, userId);
        return deleted;
    }
}
