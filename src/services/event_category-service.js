import { query } from "express";
import { EventCategoryRepository } from "../../repositories/event_category-repository.js";
import { Pagination } from "../entities/pagination.js"
import { verifyLength } from "../utils/objetoVerificacion.js";

export class EventCategoryService {
    constructor() {
        this.bd = new EventCategoryRepository();
    }

    async getAllEvent_Category(limit, offset, url){
        const [event_categories,totalCount] = await this.bd.getAllEvent_Category(limit, offset);
        return Pagination.BuildPagination(event_categories, limit, offset, url, totalCount);
    }

    async getEvent_CategoryById(id){
        const resultado = await this.bd.getEvent_CategoryById(id);
        return resultado;
    }

    async createEventCategory(event_category){
        if(!verifyLength(event_category.name)){
            return false;
        }
        else{
            const creation = await this.bd.createEventCategory(event_category);
            return creation;
        }
    }

    async updateEventCategory(event_category){
        const result = await this.bd.updateEventCategory(event_category);
        return result;
    }

    async deleteEventCategory(id){
        const deleted = await this.bd.deleteEventCategory(id);
        return deleted;
    }
    //PUNTO 12
/*
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

    async updateEventCategory(id, eventCategory) {
    if (!eventCategory.name || eventCategory.name.length < 3) {
        throw new Error("El nombre debe tener al menos tres caracteres.");
    }
    return await this.eventCategoryRepository.updateEventCategory(id, eventCategory);
    }

    async deleteEventCategory(id) {
        return await this.eventCategoryRepository.deleteEventCategory(id);
    }
    */
}
