import express from "express";
import {EventsService} from "../services/events-service.js";
import { AuthMiddleware } from "../auth/authMiddleware.js";
import { verificarObjeto } from "../utils/objetoVerificacion.js";

const router = express.Router();
const eventService = new EventsService();

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const tag = req.query.tag;
    const start_date = req.query.startdate;
    const name = req.query.name;
    const category = req.query.category;


    try{
        const allEvents = await eventService.getEvent(offset, limit, tag, start_date, name, category, req.originalUrl);
        if(allEvents){
            return res.json(allEvents);
        }
        else{
            return res.status(400).send();
        }
        
    }catch(error){ 
        console.log("Error al buscar");
        return res.json("Un Error");
    }
    
});

router.get("/:id", async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        if(event){
            return res.status(200).json(event);
        }
        else{
            return res.status(404).send();
        }
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.get("/:id/enrollment", async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    const username = req.query.username;
    const attended = req.query.attended;
    const rating = req.query.rating;
    try {
        const participants = await eventService.getParticipantEvent(req.params.id, first_name, last_name, username, attended, rating, limit, offset, req.originalUrl);
        console.log(participants);
        if(participants){
            return res.json(participants);
        }
        else{
            return res.status(400).json({ error: 'El formato de attended es inválido' });
        }
        
    }
    catch(error){
        console.log(error);
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.post("/", AuthMiddleware, async (req, res) => {
    const event = new Event();
    event = {
        name: req.body.name,
        description: req.body.description,
        id_event_category: req.body.id_event_category,
        id_event_location: req.body.id_event_location,
        start_date: req.body.start_date,
        duration_in_minutes: req.body.duration_in_minutes,
        price: req.body.price,
        enabled_for_enrollment: req.body.enabled_for_enrollment,
        max_assistance: req.body.max_assistance,
        id_creator_user: req.body.id_creator_user
    }
    
    if(verificarObjeto(event)){
        const [statusCode, mensaje] = await eventService.createEvent(event);
        return res.status(statusCode).send(mensaje);
    }
    else{
        return res.status(400).send();
    }
    
});

router.put( "/:id", AuthMiddleware, async (req,res) =>{
    const userId = req.user.id;
    const event = new Event();
    event = {
        id: req.event.id,
        name: req.body.name,
        description: req.body.description,
        id_event_category: req.body.id_event_category,
        id_event_location: req.body.id_event_location,
        start_date: req.body.start_date,
        duration_in_minutes: req.body.duration_in_minutes,
        price: req.body.price,
        enabled_for_enrollment: req.body.enabled_for_enrollment,
        max_assistance: req.body.max_assistance,
        id_creator_user: req.body.id_creator_user
    }
    if(id === undefined){
        return res.status(400).send();
    }
    else{
        const [statusCode, mensaje] = await eventService.updateEvent(event, userId);
        return res.status(statusCode).send(mensaje);
    }
});

router.delete( "/:id", AuthMiddleware, async (req,res) =>{
    const id=req.params.id;
    const userId = req.user.id;
    const eventoEliminado = await eventService.deleteEvent(id, userId);
    if(eventoEliminado){
        return res.status(232).send({//Los códigos de estado 227 a 299 no están asignados actualmente.
            valido: "evento eliminado correctamente"
        });
    }
    return res.status(400).send("Error en los campos");
});
//PUNTO 9
/*
 try {
        // Eliminar la inscripción del evento
        const enrollmentRemoved = await eventService.removeEnrollment(id_event, id_user);
        if (enrollmentRemoved) {
            return res.status(200).send({ message: "Usuario eliminado del evento correctamente." });
        } else {
            return res.status(400).send("No se pudo completar la eliminación.");
        }
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).send("Error interno del servidor.");
    }
*/


//PUNTO 10
/*
router.patch("/:id/enrollment/:enrollment_id", AuthMiddleware, async (req, res) => {
    const id_event = req.params.id;
    const id_user = req.user.id;
    const enrollment_id = req.params.enrollment_id;
    const { observations } = req.body;
    const rating = parseInt(req.body.rating); // Convertir el rating a un número entero

    try {
        // Validar que el rating esté en el rango válido (entre 1 y 10)
        if (rating < 1 || rating > 10) {
            return res.status(400).send("El rating debe estar entre 1 y 10.");
        }

        // Actualizar el event_enrollment con el rating y el feedback
        const enrollmentUpdated = await eventService.updateEnrollment(id_event, enrollment_id, id_user, rating, observations);
        if (enrollmentUpdated) {
            return res.status(200).send({ message: "Evento rankeado correctamente." });
        } else {
            return res.status(400).send("No se pudo completar la actualización.");
        }
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).send("Error interno del servidor.");
    }
});


*/


router.post("/:id/enrollment", AuthMiddleware, async (req, res) => {
    const id=req.params.id;
    const description = req.query.description;
    const attended = req.query.attended;
    const observations = req.query.observations;
    const rating = req.query.rating;
    const id_user = req.body.id_user;

    if(id_user && description && attended && observations && rating){
        const eventoActualizado = await eventService.uploadUserStuff(id, id_user, description, attended, observations, rating);
        if(eventoActualizado){//retornar 201 si se pudo registrar
            return res.status(232).send({//Los códigos de estado 227 a 299 no están asignados actualmente.
                valido: "enrollment actualizado correctamente"
            });
        }
    }
    else if(id_user){
        const enrollmentInsertado = await eventService.insertEnrollment(id, id_user);
        if(enrollmentInsertado){
            return res.status(232).send({//Los códigos de estado 227 a 299 no están asignados actualmente.
                valido: "usuario inscripto correctamente"
            });
            //PUNTO 9
            /*
    try {
        // Insertar la inscripción
        const enrollmentInserted = await eventService.insertEnrollment(id_event, id_user);
        if (enrollmentInserted) {
            return res.status(201).send({ message: "Usuario inscrito correctamente." });
        } else {
            return res.status(400).send("No se pudo completar la inscripción.");
        }
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).send("Error interno del servidor.");
    }
            */
        }
    }
    return res.status(400).send("Error");
});

//PUNTO 8
/*
router.post("/", AuthMiddleware, async (req, res) => {
    const event = {
        name: req.body.name,
        description: req.body.description,
        id_event_category: req.body.id_event_category,
        id_event_location: req.body.id_event_location,
        start_date: req.body.start_date,
        duration_in_minutes: req.body.duration_in_minutes,
        price: req.body.price,
        enabled_for_enrollment: req.body.enabled_for_enrollment,
        max_assistance: req.body.max_assistance,
        id_creator_user: req.body.id_creator_user
    };

    const errorMessage = validarEvento(event);
    if (errorMessage) {
        return res.status(400).send(errorMessage);
    }

    const [statusCode, message] = await eventService.createEvent(event);
    return res.status(statusCode).send(message);
});

router.put("/:id", AuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;
    const event = {
        id: eventId,
        name: req.body.name,
        description: req.body.description,
        id_event_category: req.body.id_event_category,
        id_event_location: req.body.id_event_location,
        start_date: req.body.start_date,
        duration_in_minutes: req.body.duration_in_minutes,
        price: req.body.price,
        enabled_for_enrollment: req.body.enabled_for_enrollment,
        max_assistance: req.body.max_assistance,
        id_creator_user: req.body.id_creator_user
    };

    const errorMessage = validarEvento(event);
    if (errorMessage) {
        return res.status(400).send(errorMessage);
    }

    const [statusCode, message] = await eventService.updateEvent(event, userId);
    return res.status(statusCode).send(message);
});

router.delete("/:id", AuthMiddleware, async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    const statusCode = await eventService.deleteEvent(eventId, userId);
    return res.status(statusCode).send();
});

function validarEvento(event) {
    if (!event.name || !event.description || event.name.length < 3 || event.description.length < 3) {
        return "El nombre o la descripción están vacíos o tienen menos de tres (3) letras.";
    }
    if (event.price < 0 || event.duration_in_minutes < 0) {
        return "El precio o la duración en minutos son menores que cero.";
    }
    return null;
}

*/

export default router;