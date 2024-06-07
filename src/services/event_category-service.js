import { query } from "express";
import { EventCategoryRepository } from "../../repositories/event_category-repository.js";

export class EventCategoryService {
    constructor() {
        this.bd = new EventCategoryRepository();
    }

    async getEvent_Category(limit, offset){
        const [event_categories,totalCount] = await this.bd.getEvent_Category(limit, offset, nextPage);
        const resultado = {
            
                collection: event_categories,
                pagination:
                    {
                        limit: limit,
                        offset: offset,
                        nextPage: (((offset+1)*limit <= totalCount) ? `${process.env.DB_USER}${nextPage}`:null),
                        total: totalCount
                    }
                };
        return resultado;
    }

    async getEvent_CategoryById(id){
        const resultado = await this.bd.getEvent_CategoryById(id);
        return resultado;
    }

    async createEventCategory(event_category){
         
    }

    async updateEventCategory(id){

    }

    async deleteEventCategory(id){

    }
}
//PUNTO 12
/*
import { EventCategoryRepository } from "../../repositories/event_category-repository.js";

export class EventCategoryService {
    constructor() {
        this.eventCategoryRepository = new EventCategoryRepository();
    }

    async getEventCategory(limit, offset, nextPage) {
        const [eventCategories, totalCount] = await this.eventCategoryRepository.getEventCategory(limit, offset);
        const pagination = {
            limit: limit,
            offset: offset,
            nextPage: (((offset + 1) * limit <= totalCount) ? nextPage : null),
            total: totalCount
        };
        return { eventCategories, pagination };
    }

    async getEventCategoryById(id) {
        return await this.eventCategoryRepository.getEventCategoryById(id);
    }

    async createEventCategory(eventCategory) {
        if (!eventCategory.name || eventCategory.name.length < 3) {
            throw new Error("El nombre debe tener al menos tres caracteres.");
        }
        return await this.eventCategoryRepository.createEventCategory(eventCategory);
    }

    async updateEventCategory
*/