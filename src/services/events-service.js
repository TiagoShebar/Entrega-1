import { query } from "express";
import { EventRepository } from "../../repositories/events-repository.js";
import { Pagination } from "../entities/pagination.js"

export class EventsService {
    constructor() {
        this.bd = new EventRepository();
    }
    async getEvent(offset, limit, tag, start_date, name, category, url){

        const regexFecha = /^\d{4}-\d{2}-\d{2}(?:\s\d{2}:\d{2}:\d{2})?$/;

        if(typeof start_date !== "undefined" && !regexFecha.test(start_date)){
            return false;
        }
        var mensajeCondicion = "";

        if(name){
            mensajeCondicion += ` WHERE e.name = '${name}'`;
        }

        if(category){
            if(mensajeCondicion.includes("WHERE")){
                mensajeCondicion += ` AND ec.name = '${category}'`;
            }
            else{
                mensajeCondicion += ` WHERE ec.name = '${category}'`;
            }
        }

        if (start_date){
            if(mensajeCondicion.includes("WHERE")){
                mensajeCondicion += ` AND e.start_date >= '${start_date}'`;
            }
            else{
                mensajeCondicion += ` WHERE e.start_date >= '${start_date}'`;
            }
        }

        if(tag){
            if(mensajeCondicion.includes("WHERE")){
                mensajeCondicion += ` AND t.name = '${tag}'`;
            }
            else{
                mensajeCondicion += ` WHERE t.name = '${tag}'`;
            }
        }
        
        limit = Pagination.ParseLimit(limit);
        offset = Pagination.ParseOffset(offset);
        const [eventos,totalCount] = await this.bd.getEvent(mensajeCondicion, limit, offset);
        return Pagination.BuildPagination(eventos, limit, offset, url, totalCount);
    }

    async getEventById(id){
        const resultado = await this.bd.getEventById(id);
        return resultado;
    }

    async getParticipantEvent(id, first_name, last_name, username, attended, rating, limit, offset, url){
        if(typeof attended !== "undefined" && attended != "true" && attended != "false") {
            return false;
        }
        
        var mensajeCondicion = "";
        if(first_name){
            mensajeCondicion += ` AND u.first_name = '${first_name}'`;
        }
        
        if(last_name){
            mensajeCondicion += ` AND u.last_name = '${last_name}'`;
        }

        if(username){
            mensajeCondicion += ` AND u.username = '${username}'`;
        }

        if(attended){
            mensajeCondicion += ` AND ee.attended = ${attended}`;
        }
        if(rating){
            mensajeCondicion += ` AND ee.rating = ${rating}`;
        }

        limit = Pagination.ParseLimit(limit);
        offset = Pagination.ParseOffset(offset);
        const [participants,totalCount] = await this.bd.getParticipantEvent(id, mensajeCondicion, limit, offset);
        
        return Pagination.BuildPagination(participants, limit, offset, url, totalCount);
    }

    async createEvent(event){
        const mensaje = this.verificarEvento(event);
        if(mensaje == null){
            const [statusCode, mensaje] = await this.bd.createEvent(event);
            return [statusCode, mensaje];
        }
        else{
            return [400, mensaje];
        }
        
    }

    verificarEvento(e) {
        if(e.name !== undefined && e.name.length < 3 || e.description !== undefined && e.description.length < 3){
            return "El name o description están vacíos o tienen menos de tres (3) letras.";
        }
        else if(e.price !== undefined && e.price < 0|| e.duration_in_minutes !== undefined && e.duration_in_minutes < 0){
            return "El price o duration_in_minutes son menores que cero.";
        }
        else{
            return null;
        }
    }

//PUNTO 8. Verificar que esto funcione. Me pa que está mal
/*
async createEvent(event) {
    const errorMessage = this.validateEvent(event);
    if (errorMessage) {
        return [400, errorMessage];
    }
    return await this.bd.createEvent(event);
}

async updateEvent(event, userId) {
    const errorMessage = this.validateEvent(event);
    if (errorMessage) {
        return [400, errorMessage];
    }
    return await this.bd.updateEvent(event, userId);
}

validateEvent(event) {
    if (!event.name || !event.description || event.name.length < 3 || event.description.length < 3) {
        return "El nombre o la descripción están vacíos o tienen menos de tres (3) letras.";
    }
    if (event.price < 0 || event.duration_in_minutes < 0) {
        return "El precio o la duración en minutos son menores que cero.";
    }
    return null;
}
*/
    async updateEvent(event, userId){
        const mensaje = this.verificarEvento(event);
        if(mensaje == null){
            const [statusCode, mensaje] = await this.bd.updateEvent(event, userId);
            return [statusCode, mensaje];
        }
        else{
            return [400, mensaje];
        }
        
    }

    async deleteEvent(id, userId){
        const [eventDeleted, statusCode, mensaje] = await this.bd.deleteEvent(id, userId);
        return [eventDeleted, statusCode, mensaje];
    }
    //PUNTO 9
    /*
    try {
            // Verificar si el evento ya ocurrió
            const eventInfo = await this.bd.query("SELECT start_date FROM events WHERE id = $1", [id_event]);
            if (eventInfo.rows.length === 0 || eventInfo.rows[0].start_date <= new Date()) {
                return false; // El evento ya ocurrió o no existe
            }

            // Eliminar la inscripción del usuario en el evento
            const result = await this.bd.query("DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2", [id_event, id_user]);
            return result.rowCount > 0; // Devuelve true si se eliminó la inscripción, false si no
        } catch (error) {
            console.error("Error al eliminar la inscripción del evento:", error);
            return false; // Error al eliminar la inscripción
        }
    }
    */


    //PUNTO 10
/*
async updateEnrollment(id_event, enrollment_id, id_user, rating, observations) {
    try {
        // Verificar si el evento ya ocurrió
        const eventInfo = await this.bd.query("SELECT start_date FROM events WHERE id = $1", [id_event]);
        if (eventInfo.rows.length === 0 || eventInfo.rows[0].start_date > new Date()) {
            return false; // El evento no ha finalizado aún
        }

        // Actualizar el event_enrollment con el rating y el feedback
        const result = await this.bd.query("UPDATE event_enrollments SET rating = $1, observations = $2 WHERE id = $3 AND id_event = $4 AND id_user = $5", [rating, observations, enrollment_id, id_event, id_user]);
        return result.rowCount > 0; // Devuelve true si se actualizó la inscripción, false si no
    } catch (error) {
        console.error("Error al actualizar la inscripción del evento:", error);
        return false; // Error al actualizar la inscripción
    }
}
*/
    async insertEnrollment(id_event, id_user){
        const [statusCode, mensaje] = await this.bd.insertEnrollment(id_event, id_user);
        return [statusCode, mensaje];
    }

    async deleteEnrollment(id_event, id_user){
        const [statusCode, mensaje] = await this.bd.deleteEnrollment(id_event, id_user);
        return [statusCode, mensaje];
    }

    async uploadUserStuff(id_event, id_user, observations, rating){
        const [statusCode, mensaje] = this.bd.uploadUserStuff(id, id_user, observations, rating);
        return [statusCode, mensaje];
    }
    //PUNTO 9
    /*
    async insertEnrollment(id_event, id_user) {
        try {
            // Verificar si el usuario ya está inscrito en el evento
            const existe = await this.bd.query("SELECT id FROM event_enrollments WHERE id_event = $1 AND id_user = $2", [id_event, id_user]);
            if (existe && existe.rows.length > 0) {
                return false; // El usuario ya está inscrito en el evento
            }

            // Insertar la inscripción
            const sql = "INSERT INTO event_enrollments (id_event, id_user, registration_date_time) VALUES ($1, $2, CURRENT_TIMESTAMP)";
            await this.bd.query(sql, [id_event, id_user]);
            return true; // Inscripción exitosa
        } catch (error) {
            console.error("Error al insertar la inscripción:", error);
            return false; // Error al insertar la inscripción
        }
    }

    async uploadUserStuff(id_event, id_user, description, attended, observations, rating) {
        try {
            // Verificar si el evento ya ocurrió
            const existe = await this.bd.query("SELECT ee.id, e.start_date FROM event_enrollments ee INNER JOIN events e ON ee.id_event = e.id_event WHERE ee.id_event = $1 AND ee.id_user = $2", [id_event, id_user]);
            const hoy = new Date();
            if (existe && existe.rows.length > 0 && existe.rows[0].start_date < hoy) {
                const sql = "UPDATE event_enrollments SET description = $1, attended = $2, observations = $3, rating = $4 WHERE id_event = $5 AND id_user = $6";
                await this.bd.query(sql, [description, attended, observations, rating, id_event, id_user]);
                return true; // Actualización exitosa
            }
            return false; // El evento ya ocurrió o no existe la inscripción
        } catch (error) {
            console.error("Error al actualizar los datos del usuario:", error);
            return false; // Error al actualizar los datos del usuario
        }
    }   
    */
}