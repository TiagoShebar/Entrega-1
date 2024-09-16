import pg from 'pg';
import { DBConfig } from "./dbconfig.js";
import { makeUpdate } from '../src/utils/functions.js';
import { query } from 'express';


export class EventRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    queryTraerEvento() {
        const query = `
            SELECT DISTINCT ON (e.id)
                e.id, 
                e.name, 
                e.description, 
                json_build_object (
                    'id', ec.id,
                    'name', ec.name
                ) AS event_category,
                json_build_object (
                    'id', el.id,
                    'name', el.name,
                    'full_address', el.full_address,
                    'latitude', el.latitude,
                    'longitude', el.longitude,
                    'max_capacity', el.max_capacity,
                    'location', json_build_object (
                        'id', l.id,
                        'name', l.name,
                        'latitude', l.latitude,
                        'longitude', l.longitude,
                        'max_capacity', el.max_capacity,
                        'province', json_build_object (
                            'id', p.id,
                            'name', p.name,
                            'full_name', p.full_name,
                            'latitude', p.latitude,
                            'longitude', p.longitude,
                            'display_order', p.display_order
                        )
                    )
                ) AS event_location,
                e.start_date, 
                e.duration_in_minutes, 
                e.price, 
                e.enabled_for_enrollment, 
                e.max_assistance, 
                json_build_object (
                    'id', u.id,
                    'username', u.username,
                    'first_name', u.first_name,
                    'last_name', u.last_name
                ) AS creator_user,
                (
                    SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
                    FROM event_tags et
                    INNER JOIN tags t ON et.id_tag = t.id
                    WHERE et.id_event = e.id
                ) AS tags
            FROM 
                events e 
            INNER JOIN 
                event_categories ec ON e.id_event_category = ec.id 
            INNER JOIN 
                event_locations el ON e.id_event_location = el.id
            INNER JOIN
                locations l ON el.id_location = l.id
            INNER JOIN
                provinces p ON l.id_province = p.id
            INNER JOIN
                users u ON e.id_creator_user = u.id
            LEFT JOIN 
                event_tags et on et.id_event = e.id
            LEFT JOIN
                tags t on et.id_tag = t.id
        `;
        return query;
    }

    async getEvent(mensajeCondicion, limit, offset) {

        var queryBase = this.queryTraerEvento() + `
            ${mensajeCondicion}
            GROUP BY 
                e.id, ec.id, el.id, l.id, p.id, u.id
            LIMIT $1
            OFFSET $2;
        `;

        console.log("aaaaaaaaaaaaaaaa", queryBase);
        const values = [limit, offset*limit];
        const respuesta = await this.DBClient.query(queryBase, values);
        
        queryBase = `
        SELECT COUNT(DISTINCT e.id) AS total 
        FROM events e 
        INNER JOIN event_categories ec ON e.id_event_category = ec.id 
        INNER JOIN event_locations el ON e.id_event_location = el.id
        INNER JOIN locations l ON el.id_location = l.id
        INNER JOIN provinces p ON l.id_province = p.id
        INNER JOIN users u ON e.id_creator_user = u.id
        LEFT JOIN event_tags et on et.id_event = e.id
        LEFT JOIN tags t on et.id_tag = t.id
        ${mensajeCondicion}
        `;

        const totalCount = await this.DBClient.query(queryBase);
    
        
        return [respuesta.rows,totalCount.rows[0].total];
    }

    async getEventById(id) {
        const query = this.queryTraerEvento() + " WHERE e.id = $1";
        const values = [id];
        const respuesta = await this.DBClient.query(query, values);
        if(respuesta.rowCount > 0){
            return respuesta.rows;
        }
        else{
            return false;
        }
        
    }

    async getParticipantEvent(id, mensajeCondicion, limit, offset){
        var query = `
        SELECT 
            json_build_object (
                'id', u.id,
                'username', u.username,
                'first_name', u.first_name,
                'last_name', u.last_name
            ) AS user,
            ee.attended,
            ee.rating,
            ee.description
        FROM 
            event_enrollments ee 
        INNER JOIN 
            users u on ee.id_user = u.id 
        WHERE ee.id_event = $1 ${mensajeCondicion}
        LIMIT $2
        OFFSET $3
        `
        
        var values = [id, limit, offset*limit];

        const respuesta = await this.DBClient.query(query, values);
        query = `SELECT COUNT(ee.id) AS total FROM event_enrollments ee INNER JOIN users u ON ee.id_user = u.id WHERE id_event = $1 ${mensajeCondicion}`;
        values=[id];   

        const totalCount = await this.DBClient.query(query,values);
        return [respuesta.rows,totalCount.rows[0].total];
    }

    async createEvent(event){
        try{
            const max_capacity = await this.traerMaxCapacity(event.id_event_location);
            if(max_capacity === undefined || event.max_assistance <= max_capacity){
                console.log(event.enabled_for_enrollment);
                const query = "INSERT INTO events (name,description,id_event_category,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id_creator_user) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
                const values = [event.name, event.description, event.id_event_category, event.id_event_location, event.start_date, event.duration_in_minutes, event.price, event.enabled_for_enrollment, event.max_assistance, event.id_creator_user];
                const resultado = await this.DBClient.query(query, values);
                if(resultado.rowCount > 0){
                    return [201, null];
                }
                else{
                    return [400, null];
                }
            }
            else{
                return [400, "El max_assistance es mayor que el max_capacity del id_event_location."];
            }
        }
        catch(error){
            return [400, error];
        }
        
       
    }

    async traerMaxCapacity(id) {
        const query = "SELECT max_capacity FROM event_locations WHERE id = $1";
        const values = [id];
        const max_capacity = await this.DBClient.query(query, values);
        return max_capacity.rows[0] === undefined ? max_capacity.rows[0] : max_capacity.rows[0].max_capacity;
    }

    async updateEvent(event){
        try {
            const max_capacity = this.traerMaxCapacity();
            if(event.max_assistance > max_capacity){
                return [400, "El max_assistance es mayor que el max_capacity del id_event_location."]
            }
    
            var sql;
            sql = `SELECT id from events WHERE id=$1 AND id_creator_user=$2`;
            var values = [event.id, event.id_creator_user];
            var respuesta = await this.DBClient.query(sql,values);
            
            if(respuesta.rowCount == 0){
                return [404, "el id del evento no existe, o el evento no pertenece al usuario autenticado."];
            }
            else {
                const [attributes, valuesSet] = makeUpdate(event, {"id": event.id, "id_creator_user": event.id_creator_user});
                let query;
                if(attributes.length > 0){
                    query = `UPDATE events SET ${attributes.join(',')} WHERE id = $${valuesSet.length+1} AND id_creator_user = $${valuesSet.length+2}`;
                }
                else{
                    query = `SELECT id FROM events WHERE id = $${valuesSet.length+1} AND id_creator_user = $${valuesSet.length+2}`
                }
        
                const result = await this.DBClient.query(query, [...valuesSet, event.id, event.id_creator_user]);
                return [200, null];
            }
        }
        catch (error){
            return [400, error];
        }
        
    }
        
        
        
    //PUNTO 8. Verificar que esto funcione. Me pa que está mal
    /*
    async createEvent(event) {
    const max_capacity = await this.getMaxCapacity(event.id_event_location);
    if (event.max_assistance > max_capacity) {
        return [400, "El max_assistance es mayor que el max_capacity del id_event_location."];
    }
    // Implementa el resto de la lógica para insertar el evento en la base de datos
}

async updateEvent(event, userId) {
    const max_capacity = await this.getMaxCapacity(event.id_event_location);
    if (event.max_assistance > max_capacity) {
        return [400, "El max_assistance es mayor que el max_capacity del id_event_location."];
    }
    // Implementa el resto de la lógica para actualizar el evento en la base de datos
}
    */

    async deleteEvent(id, userId){

        var sql = "SELECT id FROM events WHERE id = $1 AND id_creator_user = $2";
        var values = [id, userId];
        var respuesta = await this.DBClient.query(sql, values);
        if(respuesta.rowCount == 0){
            return [0, 404, "el id del evento no existe, o el evento no pertenece al usuario autenticado."];
        }
        else{
            sql = "SELECT id FROM event_enrollments WHERE id_event = $1";
            values = [id];
            respuesta = await this.DBClient.query(sql, values);
            if(respuesta.rowCount > 0){
                return [0, 400, "El evento tiene inscripciones."];
            }
            else{
                sql = "DELETE FROM event_tags WHERE id_event = $1";
                values = [id];
                respuesta = await this.DBClient.query(sql, values);
                sql = "DELETE FROM events WHERE id = $1 and id_creator_user = $2";
                values = [id, userId];
                respuesta = await this.DBClient.query(sql, values);
                return [respuesta.rowCount, 200, null];
                
            }
        }
//IMPORTANTE:
//SEGUN OSTRO VA A DAR ERROR PORQUE EL ID_CREATOR SE USA EN MUCHAS PARTES Y SI LO BOORAS CRASHEA POR EL METODO CASCADA O ALGO ASI
//SEGUN SCHIFFER HAY QUE PROBARLO Y VER SI FUNCIONA. SI NO FUNCIONA PUEDE QUE NECESITE OTRO DELETE QUE BORRE "LA TABLA" DE LOS EVENTOS DE ENROLLMENT PORQUE NO PUEDE DAR NULL O ALGO ASI
        
    }
    //PUNTO 9
    /*
    async removeEnrollment(id_event, id_user) {
    const result = await this.DBClient.query("DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2", [id_event, id_user]);
    return result.rowCount > 0; // Devuelve true si se eliminó la inscripción, false si no
}
    */

    async insertEnrollment(id_event, id_user){
        try{
            var sql = "SELECT * FROM events WHERE id = $1";
            var values = [id_event];
            const evento = await this.DBClient.query(sql, values);  
            if(evento.rowCount === 0){
                return [404, null];
            }
            else{
                if(evento.rows[0].start_date <= new Date()){
                    return [400, "El evento ya ocurrió"];
                }
                else if(evento.rows[0].enabled_for_enrollment !== true){
                    return [400, "El evento no está habilitado para inscripciones"];
                }
                else{
                    sql = "SELECT id FROM event_enrollments WHERE id_event = $1 AND id_user = $2";
                    values = [id_event, id_user];
                    const yaExisteEnrollment = await this.DBClient.query(sql,values);
                    if(yaExisteEnrollment.rowCount > 0){
                        return [400, "El usuario ya se encuentra registrado en el evento"];
                    }
                    else{
                        sql = "SELECT COUNT(id) AS cantidad FROM event_enrollments WHERE id_event = $1";
                        values = [id_event];
                        const cantidad = await this.DBClient.query(sql, values);
                        if(cantidad.rows[0].cantidad < evento.rows[0].max_assistance){
                            sql = "INSERT INTO event_enrollments (id_event,id_user,description,registration_date_time,attended,observations,rating) VALUES ($1,$2,null,CURRENT_TIMESTAMP,null,null,null)";
                            values = [id_event, id_user];
                            
                            const insert = await this.DBClient.query(sql, values);
                            return [200, null];
                        }
                        else{
                            return [400, "El evento ya alcanzó su máxima capacidad"];
                        }
                    }
                    
                }
            }
        }
        catch(error){
            console.log(error);
            return [400, error];
        }
        
    }

    async deleteEnrollment(id_event, id_user){  
        var sql = "SELECT * FROM events WHERE id = $1";
        var values = [id_event];
        const evento = await this.DBClient.query(sql, values);
        if(evento.rowCount == 0){
            return [404, null];
        }
        else{
            sql = "SELECT id from event_enrollments WHERE id_event = $1 AND id_user = $2";
            values = [id_event, id_user];
            const existe = await this.DBClient.query(sql, values);
            if(existe.rowCount === 0){
                return [400, "Se intenta remover de un evento en el que no esta registrado"];
            }
            else{
                if(evento.rows[0].start_date <= new Date()){
                    return [400, "Intenta removerse de un evento que ya sucedió (start_date), o la fecha del evento es hoy."];
                }
                else{
                    sql = "DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2";
                    const deleted = await this.DBClient.query(sql, values);
                    if(deleted.rowCount > 0){
                        return [200, null];
                    }
                    else{
                        return [400,null];
                    }
                }
            }
        }

    }

    async uploadUserStuff(id_event, id_user, observations, rating){
        var sql = "SELECT * FROM events WHERE id = $1";
        var values = [id_event];
        const evento = await this.DBClient.query(sql, values);
        if(evento.rowCount == 0){
            return [404, null];
        }
        else{
            sql = "SELECT id FROM event_enrollments WHERE id_event = $1 AND id_user = $2";
            values = [id_event, id_user];
            const existe = await this.DBClient.query(sql, values);
            if(existe.rowCount > 0){
                if(evento.rows[0].start_date <= new Date()){
                    if(rating >= 1 && rating <= 10){
                        if(observations !== undefined){
                            sql = "UPDATE event_enrollments SET rating = $1, observations = $2 WHERE id_event = $3 AND id_user = $4";
                            values = [rating, observations, id_event, id_user];
                        }else{
                            sql = "UPDATE event_enrollments SET rating = $1 WHERE id_event = $3 AND id_user = $4";
                            values = [rating, id_event, id_user];
                        }
                        
                        const enrollmentActualizado = await this.DBClient.query(sql, values);
                        if(enrollmentActualizado.rowCount > 0){
                            return [200, null];
                        }
                        else{
                            return [400, null];
                        }
                    }
                    else{
                        return [400, "Los valores del rating (rating), no se encuentran entre 1 y 10 (inclusives)"];
                    }
                    
                }
                else{
                    return [400, "El evento no ha finalizado aún, la fecha (start_date) tiene que ser mayor a hoy."];
                }
            }
            else{
                return [400, "El usuario no está inscripto en el evento"];
            }
        }
    }
}
