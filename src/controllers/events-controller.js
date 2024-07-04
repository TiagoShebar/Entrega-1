import express from "express";
import {EventsService} from "../services/events-service.js";
import { AuthMiddleware } from "../auth/AuthMiddleware.js";
import { verifyPaginationResources } from "../utils/functions.js";
import { Event } from "../entities/event.js";

const router = express.Router();
const eventService = new EventsService();

router.get("/", async (req, res) => {
    let limit = req.query.limit;
    const page = req.query.page;
    const tag = req.query.tag;
    const start_date = req.query.startdate;
    const name = req.query.name;
    const category = req.query.category;

    let offset; 
    [limit, offset]= verifyPaginationResources(limit, page);
    if(isNaN(limit)){
        return res.status(400).send(limit);
    } else if (isNaN(limit)){
        return res.status(400).send(offset);
    }

    try{
        const allEvents = await eventService.getEvent(offset, limit, tag, start_date, name, category, req.originalUrl);
        if(allEvents){
            return res.status(200).json(allEvents);
        }
        else{
            return res.status(400).send();
        }
        
    }catch(error){ 
        console.log("Error al buscar");
        return res.json(error);
    }
    
});

router.get("/:id", async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        if(event === false){
            return res.status(404).send();
        }
        else{
            return res.status(200).json(event);
        }
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.get("/:id/enrollment", async (req, res) => {
    let limit = req.query.limit;
    const page = req.query.page;
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    const username = req.query.username;
    const attended = req.query.attended;
    const rating = req.query.rating;

    let offset; 
    [limit, offset]= verifyPaginationResources(limit, page);
    if(isNaN(limit)){
        return res.status(400).send(limit);
    } else if (isNaN(limit)){
        return res.status(400).send(offset);
    }

    try {
        const participants = await eventService.getParticipantEvent(req.params.id, first_name, last_name, username, attended, rating, limit, offset, req.originalUrl);
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
    const event = new Event(
        null,
        req.body.name,
        req.body.description,
        req.body.id_event_category,
        req.body.id_event_location,
        req.body.start_date,
        req.body.duration_in_minutes,
        req.body.price,
        req.body.enabled_for_enrollment,
        req.body.max_assistance,
        req.user.id
    );
    
    const verificacion = event.verifyObject();
    if(verificacion !== true){
        return res.status(400).send(verificacion);
    }

        const [statusCode, mensaje] = await eventService.createEvent(event);
        return res.status(statusCode).send(mensaje);
    
});

router.put("/", AuthMiddleware, async (req,res) =>{
    const event = new Event(
        req.body.id,
        req.body.name,
        req.body.description,
        req.body.id_event_category,
        req.body.id_event_location,
        req.body.start_date,
        req.body.duration_in_minutes,
        req.body.price,
        req.body.enabled_for_enrollment,
        req.body.max_assistance,
        req.user.id
    );


    if(event.id === undefined){
        return res.status(400).send();
    }
    else{
        const [statusCode, mensaje] = await eventService.updateEvent(event);
        return res.status(statusCode).send(mensaje);
    }
});

router.delete( "/:id", AuthMiddleware, async (req,res) =>{
    const id=req.params.id;
    const userId = req.user.id;
    const [eventoEliminado,statusCode, mensaje] = await eventService.deleteEvent(id, userId);
    
    if(eventoEliminado > 0){

        return res.status(200).send();
    }
    else{
        return res.status(statusCode).send(mensaje);
    }
    
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
    const userId = req.user.id;
    const [statusCode, mensaje] = await eventService.insertEnrollment(req.params.id, userId);
    return res.status(statusCode).send(mensaje);
});

router.delete("/:id/enrollment", AuthMiddleware, async(req, res) => {
    const userId = req.user.id;
    const [statusCode, mensaje] = await eventService.deleteEnrollment(req.params.id, userId);
    return res.status(statusCode).send(mensaje);
});

router.patch("/:id/enrollment/:rating", AuthMiddleware, async (req, res) => {
    const id_event =req.params.id;
    const observations = req.body.observations;
    const rating = req.params.rating;
    const userId = req.user.id;

    const [statusCode, mensaje] = await eventService.uploadUserStuff(id_event, userId, observations, rating);
    return res.status(statusCode).send(mensaje);

});
            //PUNTO 9
            /*
    try {
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