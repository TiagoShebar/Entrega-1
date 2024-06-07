import pg from 'pg';
import { DBConfig } from "./dbconfig.js";


export class EventRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    queryTraerEvento(){
        const query = `
        SELECT 
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
        LEFT JOIN 
            event_locations el ON e.id_event_location = el.id
        INNER JOIN
            locations l ON el.id_location = l.id
        INNER JOIN
            provinces p ON l.id_province = p.id
        INNER JOIN
            users u ON e.id_creator_user = u.id
        INNER JOIN 
            event_tags et on et.id_event = e.id
        INNER JOIN
            tags t on et.id_tag = t.id
        `;
        return query;
    }

    async getEvent(mensajeCondicion, limit, offset) {
        var queryBase = this.queryTraerEvento() + `
            ${mensajeCondicion}
            LIMIT $1
            OFFSET $2;
        `;
        const values = [limit, offset*limit];
        const respuesta = await this.DBClient.query(queryBase, values);

        queryBase = `SELECT COUNT(e.id) FROM events e 
        INNER JOIN 
            event_categories ec ON e.id_event_category = ec.id 
        LEFT JOIN 
            event_locations el ON e.id_event_location = el.id
        INNER JOIN
            locations l ON el.id_location = l.id
        INNER JOIN
            provinces p ON l.id_province = p.id
        INNER JOIN
            users u ON e.id_creator_user = u.id
        INNER JOIN 
            event_tags et on et.id_event = e.id
        INNER JOIN
            tags t on et.id_tag = t.id
        ${mensajeCondicion} GROUP BY e.id`;

        const totalCount = await this.DBClient.query(queryBase);

        return [respuesta.rows,totalCount.rows.length];
    }

    async getEventById(id) {
        const query = this.queryTraerEvento() + " WHERE e.id = $1";
        const values = [id];
        const respuesta = await this.DBClient.query(query, values);
        return respuesta.rows;
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
        query = `SELECT COUNT(ee.id) FROM event_enrollments ee INNER JOIN users u ON ee.id_user = u.id WHERE id_event = $1 ${mensajeCondicion} GROUP BY ee.id`;
        values=[id];   

        const totalCount = await this.DBClient.query(query,values);
        return [respuesta.rows,totalCount.rows.length];
    }

    async createEvent(event){
        const max_capacity = await this.traerMaxCapacity(event.id_event_location);
        if(event.max_assistance <= max_capacity){
            const query = "INSERT INTO events (name,description,id_event_category,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id_creator_user) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
            const values = [event.name, event.description, event.id_event_category, event.id_event_location, event.start_date, event.duration_in_minutes, event.price, event.enabled_for_enrrolment, event.max_assistance, event.id_creator_user];
            const resultado = await this.DBClient.query(query, values);
            if(resultado.rowCount > 0){
                return [201, null];
            }
            else{
                return [400, null];
            }
        }
        else{
            return [400, "El max_assistance es mayor que el max_capacity del  id_event_location."];
        }
       
    }

    async traerMaxCapacity(id) {
        const query = "SELECT max_capacity FROM event_locations WHERE id = $1";
        const values = [id];
        const max_capacity = await this.DBClient.query(query, values);
        return max_capacity;
    }

    async updateEvent(event, userId){

        const max_capacity = await this.traerMaxCapacity(event.id_event_location);
        if(event.max_assistance > max_capacity){
            return [400, "El max_assistance es mayor que el max_capacity del  id_event_location."]
        }

        const attributes = [];
        
        if(event.name) attributes.push(`name = ${event.name}`);
        if(event.description) attributes.push(`description = ${event.description}`);
        if(event.id_event_category) attributes.push(`id_event_category = ${event.id_event_category}`);
        if(event.id_event_location) attributes.push(`id_event_location = ${event.id_event_location}`);
        if(event.start_date) attributes.push(`start_date = ${event.start_date}`);
        if(event.duration_in_minutes) attributes.push(`duration_in_minutes = ${event.duration_in_minutes}`);
        if(event.price) attributes.push(`price = ${event.price}`);
        if(event.enabled_for_enrollment) attributes.push(`enabled_for_enrollment = ${event.enabled_for_enrollment}`);
        if(event.max_assistance) attributes.push(`max_assistance = ${event.max_assistance}`);
        if(event.id_creator_user) attributes.push(`id_creator_user = ${event.id_creator_user}`);

        var sql;
        if(attributes.length == 0){
            sql = `SELECT id from events WHERE id=$1 AND id_creator_user=$2`;
        }
        else{
            sql =`UPDATE provinces SET ${attributes.join(',')} WHERE id = $1 AND id_creator_user=$2`;
        }
        const values = [event.id, userId];
        const respuesta = await this.DBClient.query(sql,values);
        if(respuesta.rowCount == 0){
            return [404, "el id del evento no existe, o el evento no pertenece al usuario autenticado."];
        }else{
            return [200, null];
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
        const query = "DELETE FROM events WHERE id = $1 and id_creator_user = $2";
//IMPORTANTE:
//SEGUN OSTRO VA A DAR ERROR PORQUE EL ID_CREATOR SE USA EN MUCHAS PARTES Y SI LO BOORAS CRASHEA POR EL METODO CASCADA O ALGO ASI
//SEGUN SCHIFFER HAY QUE PROBARLO Y VER SI FUNCIONA. SI NO FUNCIONA PUEDE QUE NECESITE OTRO DELETE QUE BORRE "LA TABLA" DE LOS EVENTOS DE ENROLLMENT PORQUE NO PUEDE DAR NULL O ALGO ASI
        const values = [id, userId];
        return await this.DBClient.query(query, values);
    }
    //PUNTO 9
    /*
    async removeEnrollment(id_event, id_user) {
    const result = await this.DBClient.query("DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2", [id_event, id_user]);
    return result.rowCount > 0; // Devuelve true si se eliminó la inscripción, false si no
}
    */

    async insertEnrollment(id_event, id_user){
        const existe = await this.DBClient.query(("SELECT id FROM event_enrollments WHERE id_event = $1 AND id_user = $2"), [id_event, id_user]);
        if(existe == null){
            const sql = "INSERT INTO event_enrollments (id_event,id_user,description,registration_date_time,attended,observations,rating) VALUES ($1,$2,null,CURRENT_TIMESTAMP,null,null,null)";
            const values = [id_event, id_user];
            return await this.DBClient.query(sql, values);
        }
        return false;
    }

    async uploadUserStuff(id_event, id_user, description, attended, observations, rating){
        const existe = await this.DBClient.query(("SELECT ee.id, e.start_date FROM event_enrollments ee INNER JOIN events e ON ee.id_event = e.id_event WHERE ee.id_event = $1 AND ee.id_user = $2"), values[id_event, id_user]);
        const hoy = new Date();
        if(existe != null && existe.start_date < hoy){
            const sql = "UPDATE event_enrollments SET description = $1, attended = $2, observations = $3, rating = $4 WHERE id_event = $5 AND id_user = $6";
            const values = [description, attended, observations, rating, id_event, id_user];
            return await this.DBClient.query(sql,values);
        }
        return false;
    }
}
