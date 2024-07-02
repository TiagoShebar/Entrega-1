//PUNTO 13, fijarse si funciona y si se ejcuta en algun momento
import express from "express";
import { EventLocationService } from "../services/event_location-service.js";
import { AuthMiddleware } from "../auth/AuthMiddleware.js";
import { Pagination } from "../entities/pagination.js"
import { EventLocation } from "../entities/event_location.js";

const router = express.Router();
const eventLocationService = new EventLocationService();

router.get("/", AuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    let limit = req.query.limit;
    const page = req.query.page;

    limit = Pagination.ParseLimit(limit);
    if(limit === false){
        return res.status(400).send();
    }
    const offset = Pagination.ParseOffset(page);
    if(offset === false){
        return res.status(400).send();
    }

    try {
        const allEventLocations = await eventLocationService.getAllEventLocations(userId, limit, offset, req.originalUrl);
        return res.status(200).json(allEventLocations);
    } catch (error) {
        console.log(error);
        return res.status(400).send();
    }
});

router.get("/:id", AuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const eventLocation = await eventLocationService.getEventLocationById(req.params.id, userId);
        if (eventLocation) {
            return res.status(200).json(eventLocation);
        } else {
            return res.status(404).send();
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send();
    }
});

router.post("/", AuthMiddleware, async (req, res) => {
    const eventLocation = new EventLocation(
        null,
        req.body.id_location,
        req.body.name,
        req.body.full_address,
        req.body.max_capacity,
        req.body.latitude,
        req.body.longitude,
        req.user.id
    );

    try {
        const created = await eventLocationService.createEventLocation(eventLocation);
        if(created === true){
            return res.status(201).send();
        }
        else if(created === false){
            return res.status(400).send("El id_location es inexistente");
        }
        else{
            return res.status(400).send(created);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

router.put("/", AuthMiddleware, async (req, res) => {
    const eventLocation = new EventLocation(
        req.body.id,
        req.body.id_location,
        req.body.name,
        req.body.full_address,
        req.body.max_capacity,
        req.body.latitude,
        req.body.longitude,
        req.user.id
    );

    if(eventLocation.id === undefined){
        return res.status(400).send("id no puesto");
    }

    try {
        const [statusCode, message] = await eventLocationService.updateEventLocation(eventLocation);
        return res.status(statusCode).send(message);
        
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

router.delete("/:id", AuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const deletedEventLocation = await eventLocationService.deleteEventLocation(req.params.id, userId);
        if (deletedEventLocation === true) {
            return res.status(200).send();
        } else {
            return res.status(404).send("el id del event_location es inexistente o no pertenece al usuario autenticado.");
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send();
    }
});

export default router;
