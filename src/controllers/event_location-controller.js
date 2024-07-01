//PUNTO 13, fijarse si funciona y si se ejcuta en algun momento
import express from "express";
import { EventLocationService } from "../services/event_location-service.js";
import { AuthMiddleware } from "../auth/AuthMiddleware.js";
import { Pagination } from "../entities/pagination.js"

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
            return res.status(404).send("Not found");
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send();
    }
});

router.post("/", AuthMiddleware, async (req, res) => {
    const eventLocation = req.body;
    eventLocation.id_creator_user = req.user.id;
    try {
        const createdEventLocation = await eventLocationService.createEventLocation(eventLocation);
        return res.status(201).json(createdEventLocation);
    } catch (error) {
        console.log(error);
        return res.status(400).send();
    }
});

router.put("/", AuthMiddleware, async (req, res) => {
    const eventLocation = req.body;
    eventLocation.id_creator_user = req.user.id;
    try {
        const updatedEventLocation = await eventLocationService.updateEventLocation(eventLocation);
        return res.status(200).json(updatedEventLocation);
    } catch (error) {
        console.log(error);
        return res.status(400).send();
    }
});

router.delete("/:id", AuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const deletedEventLocation = await eventLocationService.deleteEventLocation(req.params.id, userId);
        if (deletedEventLocation) {
            return res.status(200).json(deletedEventLocation);
        } else {
            return res.status(404).send("Not found");
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send();
    }
});

export default router;
